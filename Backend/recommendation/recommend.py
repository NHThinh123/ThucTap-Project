def get_recommendations(user_id, interaction_data, all_video_ids=None):
    data = pd.DataFrame(interaction_data, columns=["user_id", "video_id", "rating"])
    
    # Sử dụng all_video_ids nếu được cung cấp, nếu không thì lấy từ interaction_data
    all_videos = all_video_ids if all_video_ids else data["video_id"].unique()
    
    if len(data) < 10 or len(all_videos) < 2:
        return [{"video_id": str(vid), "predicted_rating": 0} for vid in all_videos]

    reader = Reader(rating_scale=(-1, 5))
    dataset = Dataset.load_from_df(data[["user_id", "video_id", "rating"]], reader)
    trainset, testset = train_test_split(dataset, test_size=0.2, random_state=42)
    
    sim_options = {"name": "cosine", "user_based": True}
    algo = KNNBasic(sim_options=sim_options, verbose=False)
    algo.fit(trainset)
    
    predictions = algo.test(testset)
    rmse = accuracy.rmse(predictions, verbose=False)
    print(f"RMSE: {rmse}", file=sys.stderr)
    
    rated_videos = data[data["user_id"] == user_id]["video_id"].values
    unrated_videos = [vid for vid in all_videos if vid not in rated_videos]
    print(f"Number of unrated videos for user {user_id}: {len(unrated_videos)}", file=sys.stderr)
    
    if not unrated_videos:
        return [{"video_id": str(vid), "predicted_rating": 0} for vid in all_videos]
    
    predictions = [algo.predict(user_id, vid) for vid in unrated_videos]
    recommendations = sorted(predictions, key=lambda x: x.est, reverse=True)
    return [{"video_id": str(pred.iid), "predicted_rating": pred.est} for pred in recommendations]

if __name__ == "__main__":
    user_id = sys.argv[1]
    interaction_data = json.loads(sys.argv[2])
    # Giả sử bạn truyền danh sách tất cả video_id từ Node.js
    all_video_ids = json.loads(sys.argv[3]) if len(sys.argv) > 3 else None
    recs = get_recommendations(user_id, interaction_data, all_video_ids)
    print(json.dumps(recs))