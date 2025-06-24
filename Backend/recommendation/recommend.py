import sys
import json
import pandas as pd
import joblib
import os
import logging
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split
from surprise import accuracy

MODEL_PATH = "svd_model.joblib"
MIN_USER_INTERACTIONS = 3
MIN_VIDEO_INTERACTIONS = 3
TOP_RECOMMENDATIONS = 5
MAX_CANDIDATES = 1000

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def filter_candidate_videos(data, all_videos, max_candidates=MAX_CANDIDATES):
    """Lọc video tiềm năng dựa trên số lượng đánh giá và điểm trung bình từ interaction_data."""
    video_stats = data.groupby('video_id').agg({
        'rating': ['mean', 'count']
    }).reset_index()
    video_stats.columns = ['video_id', 'avg_rating', 'review_count']
    
    # Lọc video có ít nhất 10 đánh giá và điểm trung bình >= 3
    popular_videos = video_stats[
        (video_stats['review_count'] >= 10) & (video_stats['avg_rating'] >= 3)
    ]['video_id'].astype(str).values
    logger.info(f"Filtered {len(popular_videos)} popular videos")
    
    return [vid for vid in all_videos if vid in popular_videos][:max_candidates]

def train_and_save_model(data):
    """Huấn luyện mô hình SVD và lưu vào file."""
    reader = Reader(rating_scale=(-1, 5))  # Rating từ -1 (dislike) đến 5 (review_rating)
    dataset = Dataset.load_from_df(data[["user_id", "video_id", "rating"]], reader)
    trainset, testset = train_test_split(dataset, test_size=0.2, random_state=42)
    
    algo = SVD(n_factors=50, n_epochs=30, lr_all=0.005, reg_all=0.02, random_state=42)
    algo.fit(trainset)
    
    predictions = algo.test(testset)
    rmse = accuracy.rmse(predictions, verbose=False)
    logger.info(f"Model trained with RMSE: {rmse}")
    
    joblib.dump(algo, MODEL_PATH)
    return algo

def get_recommendations(user_id, interaction_data, all_video_ids=None):
    """Tạo đề xuất video cho người dùng dựa trên dữ liệu đánh giá."""
    try:
        logger.info(f"Generating recommendations for user {user_id}")
        data = pd.DataFrame(interaction_data)
        
        # Lọc dữ liệu thưa
        user_counts = data["user_id"].value_counts()
        video_counts = data["video_id"].value_counts()
        data = data[
            (data["user_id"].isin(user_counts[user_counts >= MIN_USER_INTERACTIONS].index)) &
            (data["video_id"].isin(video_counts[video_counts >= MIN_VIDEO_INTERACTIONS].index))
        ]
        
        all_videos = all_video_ids if all_video_ids else data["video_id"].unique()
        logger.info(f"All videos count: {len(all_videos)}")
        
        # Kiểm tra dữ liệu đủ để chạy
        if len(data) < 10 or len(all_videos) < 2:
            logger.warning("Not enough data, returning all videos with predicted_rating 0")
            recommendations = [
                {"video_id": str(vid), "predicted_rating": 0, "is_top_recommended": i < TOP_RECOMMENDATIONS}
                for i, vid in enumerate(all_videos)
            ]
            return recommendations
        
        # Tải hoặc huấn luyện mô hình
        if os.path.exists(MODEL_PATH):
            logger.info("Loading existing model")
            algo = joblib.load(MODEL_PATH)
        else:
            logger.info("Training new model")
            algo = train_and_save_model(data)
        
        # Lấy danh sách video đã tương tác
        rated_videos = data[data["user_id"] == user_id]["video_id"].values
        unrated_videos = [vid for vid in all_videos if vid not in rated_videos]
        unrated_videos = filter_candidate_videos(data, unrated_videos)
        logger.info(f"Number of unrated videos for user {user_id}: {len(unrated_videos)}")
        
        # Dự đoán điểm cho video chưa xem
        recommendations = []
        if unrated_videos:
            predictions = [algo.predict(user_id, vid) for vid in unrated_videos]
            recommendations = [
                {"video_id": str(pred.iid), "predicted_rating": pred.est, "is_top_recommended": False}
                for pred in predictions
            ]
        
        # Sắp xếp theo predicted_rating giảm dần
        recommendations = sorted(recommendations, key=lambda x: x["predicted_rating"], reverse=True)
        
        # Đánh dấu 5 video hàng đầu
        for i, rec in enumerate(recommendations):
            rec["is_top_recommended"] = i < TOP_RECOMMENDATIONS
        
        logger.info(f"Total recommendations: {len(recommendations)}")
        return recommendations
    
    except Exception as e:
        logger.error(f"Error in recommendation: {str(e)}")
        recommendations = [
            {"video_id": str(vid), "predicted_rating": 0, "is_top_recommended": i < TOP_RECOMMENDATIONS}
            for i, vid in enumerate(all_videos)
        ]
        return recommendations

if __name__ == "__main__":
    user_id = sys.argv[1]
    interaction_data = json.loads(sys.stdin)  # Đọc interaction_data từ stdin
    all_video_ids = json.loads(sys.argv[2]) if len(sys.argv) > 2 else None
    recs = get_recommendations(user_id, interaction_data, all_video_ids)
    print(json.dumps(recs))