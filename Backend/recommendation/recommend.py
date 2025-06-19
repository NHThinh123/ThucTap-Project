import sys
import json
import pandas as pd
import joblib
import os
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split
from surprise import accuracy

MODEL_PATH = "knn_model.joblib"
MIN_USER_INTERACTIONS = 5
MIN_VIDEO_INTERACTIONS = 5
TOP_RECOMMENDATIONS = 5  # Số video được đề xuất lên đầu

def train_and_save_model(data):
    """Huấn luyện mô hình SVD và lưu vào file."""
    reader = Reader(rating_scale=(-1, 5))
    dataset = Dataset.load_from_df(data[["user_id", "video_id", "rating"]], reader)
    trainset, testset = train_test_split(dataset, test_size=0.2, random_state=42)
    
    # Sử dụng SVD thay vì KNNBasic
    algo = SVD(n_factors=100, n_epochs=20, random_state=42, verbose=False)
    algo.fit(trainset)
    
    # Đánh giá mô hình
    predictions = algo.test(testset)
    rmse = accuracy.rmse(predictions, verbose=False)
    print(f"RMSE: {rmse}", file=sys.stderr)
    
    # Lưu mô hình
    joblib.dump(algo, MODEL_PATH)
    return algo

def get_recommendations(user_id, interaction_data, all_video_ids=None):
    """Tạo đề xuất video cho người dùng dựa trên dữ liệu tương tác."""
    try:
        # Chuyển dữ liệu thành DataFrame
        data = pd.DataFrame(interaction_data)
        
        # Tiền xử lý dữ liệu thưa
        user_counts = data["user_id"].value_counts()
        video_counts = data["video_id"].value_counts()
        data = data[
            (data["user_id"].isin(user_counts[user_counts >= MIN_USER_INTERACTIONS].index)) &
            (data["video_id"].isin(video_counts[video_counts >= MIN_VIDEO_INTERACTIONS].index))
        ]
        
        # Sử dụng all_video_ids nếu được cung cấp, nếu không thì lấy từ interaction_data
        all_videos = all_video_ids if all_video_ids else data["video_id"].unique()
        print(f"All videos count: {len(all_videos)}", file=sys.stderr)
        
        # Kiểm tra dữ liệu đủ để chạy không
        if len(data) < 10 or len(all_videos) < 2:
            print("Not enough data, returning all videos with predicted_rating 0", file=sys.stderr)
            recommendations = [
                {"video_id": str(vid), "predicted_rating": 0, "is_top_recommended": i < TOP_RECOMMENDATIONS}
                for i, vid in enumerate(all_videos)
            ]
            return recommendations
        
        # Tải hoặc huấn luyện mô hình
        if os.path.exists(MODEL_PATH):
            print("Loading existing model", file=sys.stderr)
            algo = joblib.load(MODEL_PATH)
        else:
            print("Training new model", file=sys.stderr)
            algo = train_and_save_model(data)
        
        # Lấy danh sách video đã xem
        rated_videos = data[data["user_id"] == user_id]["video_id"].values
        unrated_videos = [vid for vid in all_videos if vid not in rated_videos]
        print(f"Number of unrated videos for user {user_id}: {len(unrated_videos)}", file=sys.stderr)
        
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
        
        print(f"Total recommendations: {len(recommendations)}", file=sys.stderr)
        print(f"Top {TOP_RECOMMENDATIONS} videos marked as is_top_recommended: true", file=sys.stderr)
        
        return recommendations
    
    except Exception as e:
        print(f"Error in recommendation: {str(e)}", file=sys.stderr)
        recommendations = [
            {"video_id": str(vid), "predicted_rating": 0, "is_top_recommended": i < TOP_RECOMMENDATIONS}
            for i, vid in enumerate(all_videos)
        ]
        return recommendations

if __name__ == "__main__":
    user_id = sys.argv[1]
    interaction_data = json.loads(sys.argv[2])
    all_video_ids = json.loads(sys.argv[3]) if len(sys.argv) > 3 else None
    recs = get_recommendations(user_id, interaction_data, all_video_ids)
    print(json.dumps(recs))