import sys
import json
import pandas as pd
from surprise import Dataset, Reader, KNNBasic
from surprise.model_selection import train_test_split
from surprise import accuracy

def get_recommendations(user_id, interaction_data, n=5):
    # Chuyển dữ liệu thành DataFrame
    data = pd.DataFrame(interaction_data, columns=["user_id", "video_id", "rating"])

    # Kiểm tra dữ liệu đủ để chạy không
    if len(data) < 10 or len(data["video_id"].unique()) < 2:
        return [{"video_id": str(vid), "predicted_rating": 0} for vid in data["video_id"].unique()[:n]]

    # Chuẩn bị dữ liệu cho surprise
    reader = Reader(rating_scale=(-1, 5))
    dataset = Dataset.load_from_df(data[["user_id", "video_id", "rating"]], reader)

    # Chia dữ liệu thành tập train/test
    trainset, testset = train_test_split(dataset, test_size=0.2, random_state=42)

    # Sử dụng user-based collaborative filtering với cosine similarity
    sim_options = {"name": "cosine", "user_based": True}
    algo = KNNBasic(sim_options=sim_options, verbose=False)  # Tắt thông báo debug
    algo.fit(trainset)

    # Đánh giá mô hình
    predictions = algo.test(testset)
    rmse = accuracy.rmse(predictions, verbose=False)
    print(f"RMSE: {rmse}", file=sys.stderr)  # In RMSE ra stderr

    # Lấy danh sách video chưa xem (dựa trên History, Review, Like, Dislike, Comment, Playlist)
    all_videos = data["video_id"].unique()
    rated_videos = data[data["user_id"] == user_id]["video_id"].values
    unrated_videos = [vid for vid in all_videos if vid not in rated_videos]

    # Nếu không có video chưa xem, trả về video ngẫu nhiên
    if not unrated_videos:
        return [{"video_id": str(vid), "predicted_rating": 0} for vid in all_videos[:n]]

    # Dự đoán điểm cho các video chưa xem
    predictions = [algo.predict(user_id, vid) for vid in unrated_videos]
    recommendations = sorted(predictions, key=lambda x: x.est, reverse=True)[:n]
    return [{"video_id": str(pred.iid), "predicted_rating": pred.est} for pred in recommendations]

if __name__ == "__main__":
    user_id = sys.argv[1]
    interaction_data = json.loads(sys.argv[2])  # Nhận interactionData từ args
    recs = get_recommendations(user_id, interaction_data)
    print(json.dumps(recs))  # Chỉ in JSON