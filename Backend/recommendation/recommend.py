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
TOP_RECOMMENDATIONS = 5

def train_and_save_model(data):
    """Huấn luyện mô hình SVD và lưu vào file."""
    reader = Reader(rating_scale=(-1, 5))
    dataset = Dataset.load_from_df(data[["user_id", "video_id", "rating"]], reader)
    trainset, testset = train_test_split(dataset, test_size=0.2, random_state=42)
    
    algo = SVD(n_factors=100, n_epochs=20, random_state=42, verbose=False)
    algo.fit(trainset)
    
    predictions = algo.test(testset)
    rmse = accuracy.rmse(predictions, verbose=False)
    print(f"RMSE: {rmse}", file=sys.stderr)
    
    joblib.dump(algo, MODEL_PATH)
    return algo

def get_recommendations(user_id, interaction_data, all_video_ids=None):
    """Tạo đề xuất video cho người dùng, đảm bảo chỉ đề xuất video chưa xem."""
    try:
        # Chuyển dữ liệu tương tác thành DataFrame
        data = pd.DataFrame(interaction_data)
        print(f"Số dòng dữ liệu tương tác: {len(data)}", file=sys.stderr)
        
        # Tiền xử lý dữ liệu thưa
        user_counts = data["user_id"].value_counts()
        video_counts = data["video_id"].value_counts()
        data = data[
            (data["user_id"].isin(user_counts[user_counts >= MIN_USER_INTERACTIONS].index)) &
            (data["video_id"].isin(video_counts[video_counts >= MIN_VIDEO_INTERACTIONS].index))
        ]
        print(f"Số dòng dữ liệu tương tác đã lọc: {len(data)}", file=sys.stderr)
        
        # Sử dụng all_video_ids nếu được cung cấp, nếu không lấy từ interaction_data
        all_videos = [str(vid) for vid in all_video_ids] if all_video_ids else data["video_id"].astype(str).unique().tolist()
        print(f"Tổng số video: {len(all_videos)}", file=sys.stderr)
        
        # Kiểm tra dữ liệu đủ để chạy không
        if len(data) < 10 or len(all_videos) < 2:
            print("Không đủ dữ liệu, trả về tất cả video với predicted_rating 0", file=sys.stderr)
            recommendations = [
                {"video_id": str(vid), "predicted_rating": 0, "is_top_recommended": i < TOP_RECOMMENDATIONS}
                for i, vid in enumerate(all_videos)
            ]
            return recommendations
        
        # Tải hoặc huấn luyện mô hình
        if os.path.exists(MODEL_PATH):
            print("Tải mô hình hiện có", file=sys.stderr)
            algo = joblib.load(MODEL_PATH)
        else:
            print("Huấn luyện mô hình mới", file=sys.stderr)
            algo = train_and_save_model(data)
        
        # Lấy danh sách video đã tương tác
        rated_videos = data[data["user_id"] == str(user_id)]["video_id"].astype(str).unique().tolist()
        print(f"Video đã tương tác của người dùng {user_id}: {rated_videos}", file=sys.stderr)
        
        # Đảm bảo chỉ xem xét video chưa xem
        unrated_videos = [vid for vid in all_videos if vid not in rated_videos]
        print(f"Video chưa xem của người dùng {user_id}: {unrated_videos}", file=sys.stderr)
        
        # Dự đoán điểm cho video chưa xem
        recommendations = []
        if unrated_videos:
            predictions = [algo.predict(str(user_id), vid) for vid in unrated_videos]
            recommendations = [
                {"video_id": str(pred.iid), "predicted_rating": pred.est, "is_top_recommended": False}
                for pred in predictions
            ]
        
        # Sắp xếp theo predicted_rating giảm dần
        recommendations = sorted(recommendations, key=lambda x: x["predicted_rating"], reverse=True)
        
        # Đánh dấu 5 video hàng đầu
        for i, rec in enumerate(recommendations[:TOP_RECOMMENDATIONS]):
            rec["is_top_recommended"] = True
        
        print(f"Tổng số đề xuất: {len(recommendations)}", file=sys.stderr)
        print(f"Top {TOP_RECOMMENDATIONS} video được đánh dấu is_top_recommended: true", file=sys.stderr)
        
        return recommendations
    
    except Exception as e:
        print(f"Lỗi trong đề xuất: {str(e)}", file=sys.stderr)
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