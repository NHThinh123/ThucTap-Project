import { Rate } from "antd";
import { useState } from "react";
import { AuthContext } from "../../../../contexts/auth.context";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import useGetVideoAverageRating from "../../hooks/useGetVideoAverageRating";
import useGetUserReviewForVideo from "../../hooks/useGetUserReviewForVideo";
import useCreateOrUpdateReview from "../../hooks/useCreateOrUpdateReview";
import { useEffect } from "react";

const desc = ["Rất tệ", "Tệ", "Bình thường", "Tuyệt vời", "Rất tuyệt vời"];

const ReviewSpace = () => {
  const { id } = useParams();
  const video_id = id;
  const { auth } = useContext(AuthContext);
  const user_id = auth.isAuthenticated ? auth.user.id : null;
  const [value, setValue] = useState(0);

  const { data: videoAverage } = useGetVideoAverageRating(video_id);
  const createOrUpdateReviewMutation = useCreateOrUpdateReview();

  const { data: userReview, isLoading: isLoadingUserReview } =
    useGetUserReviewForVideo(user_id, video_id);

  const average = videoAverage?.data ? videoAverage?.data.average_rating : 0;
  const review_count = videoAverage?.data
    ? videoAverage?.data.total_reviews
    : 0;

  useEffect(() => {
    if (userReview?.data?.rating) {
      setValue(userReview.data.rating);
    }
  }, [userReview]);

  // Xử lý khi user thay đổi rating
  const handleRatingChange = (newValue) => {
    setValue(newValue);

    // Chỉ gửi request khi user đã đăng nhập
    if (user_id && video_id) {
      createOrUpdateReviewMutation.mutate({
        user_id: user_id,
        video_id: video_id,
        review_rating: newValue,
      });
    }
  };
  return (
    <div
      style={{
        display: "flex",
        marginTop: 10,
        justifyContent: "end",
      }}
    >
      <div style={{ border: "1px solid #d9d9d9", borderRadius: 50 }}>
        <div
          style={{
            padding: "0 16px 0 16px",
            width: "100%",
            height: 40,
            alignContent: "center",
          }}
        >
          {" "}
          <span style={{ fontSize: 20, marginRight: 10 }}>{average}</span>
          <Rate
            tooltips={desc}
            onChange={handleRatingChange}
            value={value}
            disabled={
              createOrUpdateReviewMutation.isPending || isLoadingUserReview
            }
          />
          <span style={{ fontSize: 18, marginLeft: 10 }}>
            ({review_count} đánh giá)
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReviewSpace;
