import sys
import json
import pandas as pd
import joblib
import os
import logging
import numpy as np
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split
from surprise import accuracy
from collections import defaultdict

MODEL_PATH = "svd_model.joblib"
MIN_USER_INTERACTIONS = 1
MIN_VIDEO_INTERACTIONS = 1
TOP_RECOMMENDATIONS = 10
MAX_CANDIDATES = 300  # Giảm để tăng tốc độ xử lý

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def preprocess_interaction_data(interaction_data):
    """Xử lý và làm sạch dữ liệu tương tác, ưu tiên lịch sử xem."""
    df = pd.DataFrame(interaction_data)
    
    # Loại bỏ records không hợp lệ
    df = df.dropna(subset=['user_id', 'video_id'])
    
    # Aggregate interactions theo (user_id, video_id)
    # Tăng trọng số cho lịch sử xem dựa trên watch_duration
    def calculate_rating(row):
        rating = row['rating']
        # Nếu là history interaction, điều chỉnh rating theo watch_duration
        if 'watch_duration' in row and pd.notnull(row['watch_duration']):
            if row['watch_duration'] >= 300:  # Xem >= 5 phút
                rating = min(5, rating + 2.0)
            elif row['watch_duration'] >= 120:  # Xem >= 2 phút
                rating = min(5, rating + 1.5)
            elif row['watch_duration'] >= 30:  # Xem >= 30 giây
                rating = min(5, rating + 1.0)
        return rating
    
    # Áp dụng logic tính rating
    df['rating'] = df.apply(calculate_rating, axis=1)
    
    # Aggregate ratings, lấy max rating để ưu tiên hành vi tích cực
    aggregated = df.groupby(['user_id', 'video_id'])['rating'].max().reset_index()
    aggregated['rating'] = aggregated['rating'].clip(-2, 5)
    
    logger.info(f"Original interactions: {len(df)}, After aggregation: {len(aggregated)}")
    return aggregated

def calculate_video_popularity_score(data):
    """Tính điểm popularity với trọng số dựa trên loại tương tác."""
    video_stats = data.groupby('video_id').agg({
        'rating': ['mean', 'count', 'std']
    }).reset_index()
    
    video_stats.columns = ['video_id', 'avg_rating', 'interaction_count', 'rating_std']
    video_stats['rating_std'] = video_stats['rating_std'].fillna(0)
    
    # Tính weighted score, ưu tiên video có nhiều interactions tích cực
    video_stats['popularity_score'] = (
        video_stats['avg_rating'] * np.log1p(video_stats['interaction_count']) * 
        (1 - 0.05 * video_stats['rating_std'])
    )
    
    return video_stats

def filter_candidate_videos(data, all_videos, max_candidates=MAX_CANDIDATES):
    """Lọc video tiềm năng dựa trên popularity và lịch sử xem tích cực."""
    video_stats = calculate_video_popularity_score(data)
    
    # Lọc video có ít nhất 2 interactions và avg_rating >= 1.5
    qualified_videos = video_stats[
        (video_stats['interaction_count'] >= 2) & 
        (video_stats['avg_rating'] >= 1.5)
    ].sort_values('popularity_score', ascending=False)
    
    popular_video_ids = qualified_videos['video_id'].astype(str).values
    logger.info(f"Filtered {len(popular_video_ids)} qualified videos from {len(video_stats)} total")
    
    # Kết hợp popular videos và một số video ngẫu nhiên
    remaining_videos = [vid for vid in all_videos if vid not in popular_video_ids]
    final_candidates = list(popular_video_ids[:max_candidates//2])
    
    if remaining_videos:
        random_sample_size = min(max_candidates//2, len(remaining_videos))
        random_sample = np.random.choice(remaining_videos, random_sample_size, replace=False)
        final_candidates.extend(random_sample)
    
    return final_candidates[:max_candidates]

def train_and_save_model(data):
    """Huấn luyện mô hình SVD với hyperparameters tối ưu."""
    reader = Reader(rating_scale=(-2, 5))
    dataset = Dataset.load_from_df(data[["user_id", "video_id", "rating"]], reader)
    trainset, testset = train_test_split(dataset, test_size=0.2, random_state=42)
    
    algo = SVD(
        n_factors=120,    # Tăng để capture pattern phức tạp hơn
        n_epochs=60,      # Tăng số lần lặp
        lr_all=0.003,     # Giảm learning rate để ổn định hơn
        reg_all=0.015,    # Giảm regularization để fit tốt hơn
        random_state=42
    )
    
    algo.fit(trainset)
    
    predictions = algo.test(testset)
    rmse = accuracy.rmse(predictions, verbose=False)
    logger.info(f"Model trained with RMSE: {rmse:.4f}")
    
    model_data = {
        'algorithm': algo,
        'rmse': rmse,
        'train_size': len(trainset.all_ratings()),
        'n_users': trainset.n_users,
        'n_items': trainset.n_items
    }
    
    joblib.dump(model_data, MODEL_PATH)
    return algo

def get_content_based_fallback(user_id, interaction_data, all_video_ids, limit=TOP_RECOMMENDATIONS):
    """Content-based fallback dựa trên lịch sử xem và đánh giá tích cực."""
    df = pd.DataFrame(interaction_data)
    
    # Lấy videos mà user đã xem hoặc đánh giá cao
    user_interactions = df[(df['user_id'] == user_id) & (df['rating'] >= 2.5)]
    
    if len(user_interactions) == 0:
        # Cold start: return popular videos
        video_stats = calculate_video_popularity_score(df)
        top_videos = video_stats.nlargest(limit, 'popularity_score')['video_id'].astype(str).tolist()
    else:
        # Lấy danh sách video tương tự dựa trên lịch sử xem tích cực
        liked_videos = user_interactions['video_id'].astype(str).tolist()
        similar_users = df[
            (df['video_id'].isin(liked_videos)) & 
            (df['rating'] >= 2.5) & 
            (df['user_id'] != user_id)
        ]['user_id'].unique()
        
        # Tìm video mà các user tương tự đã xem/rating cao
        similar_user_videos = df[
            (df['user_id'].isin(similar_users)) & 
            (df['rating'] >= 2.5) & 
            (~df['video_id'].isin(liked_videos))
        ]
        
        if len(similar_user_videos) > 0:
            video_stats = calculate_video_popularity_score(similar_user_videos)
            top_videos = video_stats.nlargest(limit, 'popularity_score')['video_id'].astype(str).tolist()
        else:
            # Fallback to overall popular videos
            video_stats = calculate_video_popularity_score(df)
            top_videos = video_stats.nlargest(limit, 'popularity_score')['video_id'].astype(str).tolist()
    
    return [
        {
            "video_id": str(vid),
            "predicted_rating": 3.0,
            "is_top_recommended": i < TOP_RECOMMENDATIONS,
            "is_watched": False,
            "popularity_score": 0
        } for i, vid in enumerate(top_videos)
    ]

def get_all_videos_with_popularity_ranking(user_id, interaction_data, all_video_ids):
    """PERSONALIZED fallback với lịch sử xem và đánh giá."""
    logger.info(f"Using PERSONALIZED popularity-based ranking for user {user_id}")
    
    df = pd.DataFrame(interaction_data) if interaction_data else pd.DataFrame()
    all_videos = all_video_ids if all_video_ids else []
    
    # Tính popularity score
    video_popularity = {}
    if len(df) > 0:
        video_stats = calculate_video_popularity_score(df)
        video_popularity = dict(zip(video_stats['video_id'].astype(str), video_stats['popularity_score']))
    
    # Lấy lịch sử xem và preferences
    watched_videos = set()
    user_liked_videos = []
    user_avg_rating = 3.0
    
    if len(df) > 0:
        user_data = df[df['user_id'] == user_id]
        watched_videos = set(str(vid) for vid in user_data['video_id'].values)
        
        if len(user_data) > 0:
            user_avg_rating = user_data['rating'].mean()
            user_liked_videos = user_data[user_data['rating'] >= user_avg_rating]['video_id'].astype(str).tolist()
            logger.info(f"User {user_id} avg rating: {user_avg_rating:.2f}, liked {len(user_liked_videos)} videos")
    
    # Tạo danh sách video chưa xem
    unwatched_videos = []
    
    for video_id in all_videos:
        video_id_str = str(video_id)
        if video_id_str not in watched_videos:
            base_popularity = video_popularity.get(video_id_str, 0)
            
            # Cá nhân hóa: Boost video tương tự với video đã thích
            personalization_boost = 0
            if user_liked_videos:
                similar_users = df[df['video_id'].isin([int(v) for v in user_liked_videos])]['user_id'].unique()
                if len(similar_users) > 1:
                    video_ratings = df[(df['video_id'] == int(video_id_str)) & (df['user_id'].isin(similar_users))]
                    if len(video_ratings) > 0:
                        avg_rating_from_similar = video_ratings['rating'].mean()
                        if avg_rating_from_similar >= user_avg_rating:
                            personalization_boost = 0.7 * len(video_ratings)
            
            final_score = base_popularity + personalization_boost
            
            video_info = {
                "video_id": video_id_str,
                "predicted_rating": final_score,
                "is_top_recommended": False,
                "is_watched": False,
                "popularity_score": base_popularity,
                "personalization_boost": personalization_boost
            }
            unwatched_videos.append(video_info)
    
    # Sắp xếp và đánh dấu top recommendations
    unwatched_videos = sorted(unwatched_videos, key=lambda x: x["predicted_rating"], reverse=True)
    
    for i in range(min(TOP_RECOMMENDATIONS, len(unwatched_videos))):
        unwatched_videos[i]["is_top_recommended"] = True
    
    logger.info(f"Personalized ranking: {len(unwatched_videos)} unwatched videos. Excluded {len(watched_videos)} watched videos")
    return unwatched_videos

def get_recommendations(user_id, interaction_data, all_video_ids=None):
    """Tạo đề xuất video chưa xem với AI và lịch sử xem."""
    try:
        logger.info(f"Generating recommendations for user {user_id}")
        
        # Preprocess data
        data = preprocess_interaction_data(interaction_data)
        all_videos = all_video_ids if all_video_ids else []
        
        if len(data) < 5 or len(all_videos) < 2:
            logger.warning("Insufficient data for ML, using personalized fallback")
            return get_all_videos_with_popularity_ranking(user_id, interaction_data, all_videos)
        
        # Filter sparse data
        user_counts = data["user_id"].value_counts()
        video_counts = data["video_id"].value_counts()
        filtered_data = data[
            (data["user_id"].isin(user_counts[user_counts >= MIN_USER_INTERACTIONS].index)) &
            (data["video_id"].isin(video_counts[video_counts >= MIN_VIDEO_INTERACTIONS].index))
        ]
        
        if len(filtered_data) < 5:
            logger.warning("Not enough filtered data for ML, using personalized fallback")
            return get_all_videos_with_popularity_ranking(user_id, interaction_data, all_videos)
        
        # Load or train model
        if os.path.exists(MODEL_PATH):
            logger.info("Loading existing model")
            model_data = joblib.load(MODEL_PATH)
            algo = model_data['algorithm']
            logger.info(f"Loaded model with RMSE: {model_data.get('rmse', 'N/A')}")
        else:
            logger.info("Training new model")
            algo = train_and_save_model(filtered_data)
        
        # Lấy danh sách video đã xem từ tất cả interactions
        user_interactions = data[data["user_id"] == user_id]["video_id"].values
        rated_videos = set(str(vid) for vid in user_interactions)
        unrated_videos = [str(vid) for vid in all_videos if str(vid) not in rated_videos]
        
        logger.info(f"User {user_id} has {len(rated_videos)} interactions")
        logger.info(f"Unrated videos: {len(unrated_videos)}")
        
        # Lọc video tiềm năng
        candidate_videos = filter_candidate_videos(data, unrated_videos)
        
        # AI Predictions
        ai_predictions = {}
        if candidate_videos:
            videos_in_training = set(str(vid) for vid in filtered_data["video_id"].values)
            predictable_videos = [vid for vid in candidate_videos if str(vid) in videos_in_training]
            
            batch_size = 100
            for i in range(0, len(predictable_videos), batch_size):
                batch = predictable_videos[i:i+batch_size]
                batch_predictions = [algo.predict(user_id, vid) for vid in batch]
                for pred in batch_predictions:
                    ai_predictions[str(pred.iid)] = pred.est
            
            logger.info(f"Generated AI predictions for {len(ai_predictions)} videos")
        
        # Tạo danh sách video chưa xem
        video_popularity = {}
        if len(data) > 0:
            video_stats = calculate_video_popularity_score(data)
            video_popularity = dict(zip(video_stats['video_id'].astype(str), video_stats['popularity_score']))
        
        ai_recommended = []
        other_videos = []
        
        for video_id in unrated_videos:
            predicted_rating = ai_predictions.get(str(video_id), 0)
            base_popularity = video_popularity.get(str(video_id), 0)
            
            # Cá nhân hóa thêm dựa trên lịch sử xem
            personalization_boost = 0
            if len(data) > 0 and predicted_rating == 0:  # Chỉ áp dụng cho non-AI predicted
                user_data = data[data['user_id'] == user_id]
                liked_videos = user_data[user_data['rating'] >= 2.5]['video_id'].astype(str).tolist()
                if liked_videos:
                    similar_users = data[
                        (data['video_id'].isin(liked_videos)) & 
                        (data['rating'] >= 2.5) & 
                        (data['user_id'] != user_id)
                    ]['user_id'].unique()
                    
                    video_ratings = data[
                        (data['video_id'] == int(video_id)) & 
                        (data['user_id'].isin(similar_users))
                    ]
                    if len(video_ratings) > 0:
                        personalization_boost = 0.7 * video_ratings['rating'].mean()
            
            final_score = predicted_rating + base_popularity + personalization_boost
            
            video_info = {
                "video_id": str(video_id),
                "predicted_rating": final_score,
                "is_top_recommended": False,
                "is_watched": False,
                "popularity_score": base_popularity,
                "personalization_boost": personalization_boost
            }
            
            if str(video_id) in ai_predictions:
                ai_recommended.append(video_info)
            else:
                other_videos.append(video_info)
        
        # Sắp xếp và đánh dấu top recommendations
        ai_recommended = sorted(ai_recommended, key=lambda x: x["predicted_rating"], reverse=True)
        other_videos = sorted(other_videos, key=lambda x: x["predicted_rating"], reverse=True)
        
        for i in range(min(TOP_RECOMMENDATIONS, len(ai_recommended))):
            ai_recommended[i]["is_top_recommended"] = True
        
        # Kết hợp kết quả
        final_results = ai_recommended + other_videos
        
        # Đảm bảo tính đa dạng
        if len(final_results) > TOP_RECOMMENDATIONS * 2:
            user_seed = int(user_id[-6:], 16) % 100000
            np.random.seed(user_seed)
            non_top_videos = [v for v in final_results if not v["is_top_recommended"]]
            top_videos = [v for v in final_results if v["is_top_recommended"]]
            np.random.shuffle(non_top_videos)
            final_results = top_videos + non_top_videos
            np.random.seed(None)
        
        logger.info(f"Final results: {len(ai_recommended)} AI recommended, {len(other_videos)} other videos")
        return final_results
    
    except Exception as e:
        logger.error(f"Error in recommendation: {str(e)}")
        return get_all_videos_with_popularity_ranking(user_id, interaction_data, all_videos)

if __name__ == "__main__":
    user_id = sys.argv[1]
    interaction_data = json.loads(sys.argv[2])
    all_video_ids = json.loads(sys.argv[3]) if len(sys.argv) > 3 else None
    recs = get_recommendations(user_id, interaction_data, all_video_ids)
    print(json.dumps(recs))