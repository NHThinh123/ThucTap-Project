import sys
import json
import pandas as pd
from surprise import Dataset, Reader, KNNBasic
from surprise.model_selection import train_test_split
from surprise import accuracy

def get_recommendations(user_id, interaction_data, all_video_ids=None):
    # Chuyển dữ liệu thành DataFrame
    data = pd.DataFrame(interaction_data, columns=["user_id", "video_id", "rating"])
    
    # Sử dụng all_video_ids nếu được cung cấp, nếu không thì lấy từ interaction_data
    all_videos = all_video_ids if all_video_ids else data["video_id"].unique()
    print(f"All videos count: {len(all_videos)}", file=sys.stderr)
    print(f"All videos: {all_videos}", file=sys.stderr)
    
    # Kiểm tra dữ liệu đủ để chạy không
    if len(data) < 10 or len(all_videos) < 2:
        print("Not enough data, returning all videos with predicted_rating 0", file=sys.stderr)
        return [{"video_id": str(vid), "predicted_rating": 0} for vid in all_videos]

    # Chuẩn bị dữ liệu cho surprise
    reader = Reader(rating_scale=(-1, 5))
    dataset = Dataset.load_from_df(data[["user_id", "video_id", "rating"]], reader)
    trainset, testset = train_test_split(dataset, test_size=0.2, random_state=42)
    
    # Sử dụng user-based collaborative filtering với cosine similarity
    sim_options = {"name": "cosine", "user_based": True}
    algo = KNNBasic(sim_options=sim_options, verbose=False)
    algo.fit(trainset)
    
    # Đánh giá mô hình
    predictions = algo.test(testset)
    rmse = accuracy.rmse(predictions, verbose=False)
    print(f"RMSE: {rmse}", file=sys.stderr)
    
    # Lấy danh sách video đã xem và chưa xem
    rated_videos = data[data["user_id"] == user_id]["video_id"].values
    unrated_videos = [vid for vid in all_videos if vid not in rated_videos]
    print(f"Number of unrated videos for user {user_id}: {len(unrated_videos)}", file=sys.stderr)
    print(f"Unrated videos: {unrated_videos}", file=sys.stderr)
    print(f"Number of rated videos for user {user_id}: {len(rated_videos)}", file=sys.stderr)
    print(f"Rated videos: {rated_videos}", file=sys.stderr)
    
    # Dự đoán điểm cho video chưa xem
    recommendations = []
    if unrated_videos:
        unrated_predictions = [algo.predict(user_id, vid) for vid in unrated_videos]
        recommendations.extend([{"video_id": str(pred.iid), "predicted_rating": pred.est} for pred in unrated_predictions])
    
    # Dự đoán điểm cho video đã xem
    rated_predictions = [algo.predict(user_id, vid) for vid in rated_videos]
    recommendations.extend([{"video_id": str(pred.iid), "predicted_rating": pred.est} for pred in rated_predictions])
    
    # Sắp xếp tất cả video theo predicted_rating giảm dần
    recommendations = sorted(recommendations, key=lambda x: x["predicted_rating"], reverse=True)
    print(f"Total recommendations: {len(recommendations)}", file=sys.stderr)
    
    return recommendations

if __name__ == "__main__":
    user_id = sys.argv[1]
    interaction_data = json.loads(sys.argv[2])
    all_video_ids = json.loads(sys.argv[3]) if len(sys.argv) > 3 else None
    recs = get_recommendations(user_id, interaction_data, all_video_ids)
    print(json.dumps(recs))