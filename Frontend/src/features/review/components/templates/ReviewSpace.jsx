import { Rate } from "antd";
import { useState } from "react";
import { AuthContext } from "../../../../contexts/auth.context";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import useGetVideoAverageRating from "../../hooks/useGetVideoAverageRating";
import useGetUserReviewForVideo from "../../hooks/useGetUserReviewForVideo";
import useCreateOrUpdateReview from "../../hooks/useCreateOrUpdateReview";
import { useEffect } from "react";
import LoginRequiredModal from "../../../../components/templates/LoginRequiredModal";

const desc = ["Rất tệ", "Tệ", "Bình thường", "Tuyệt vời", "Rất tuyệt vời"];

const ReviewSpace = () => {
  const { id } = useParams();
  const video_id = id;
  const { auth } = useContext(AuthContext);
  const user_id = auth.isAuthenticated ? auth.user.id : null;
  const [value, setValue] = useState(0);
  const [dimensions, setDimensions] = useState({
    fontSize: 18,
    margin: 10,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showLoginModal = () => setIsModalOpen(true);
  const handleCancelModal = () => setIsModalOpen(false);

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
    if (!auth.isAuthenticated) {
      showLoginModal();
      return;
    }
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

  // Cập nhật kích thước dựa trên kích thước màn hình
  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      const breakpoints = {
        xs: 576,
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1200,
        xxl: 1600,
      };

      if (width < breakpoints.sm) {
        // xs
        setDimensions({
          fontSize: 14,
          margin: 6,
        });
      } else if (width < breakpoints.md) {
        // sm
        setDimensions({
          fontSize: 15,
          margin: 7,
        });
      } else if (width < breakpoints.lg) {
        // md
        setDimensions({
          fontSize: 16,
          margin: 8,
        });
      } else if (width < breakpoints.xl) {
        // lg
        setDimensions({
          fontSize: 17,
          margin: 9,
        });
      } else if (width < breakpoints.xxl) {
        // xl
        setDimensions({
          fontSize: 18,
          margin: 10,
        });
      } else {
        // xxl
        setDimensions({
          fontSize: 18,
          margin: 10,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
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
          <span
            style={{
              fontSize: dimensions.fontSize,
              marginRight: dimensions.margin,
            }}
          >
            {average}
          </span>
          <Rate
            tooltips={desc}
            onChange={handleRatingChange}
            value={value}
            disabled={
              createOrUpdateReviewMutation.isPending || isLoadingUserReview
            }
          />
          <span
            style={{
              fontSize: dimensions.fontSize,
              marginLeft: dimensions.margin,
            }}
          >
            ({review_count} đánh giá)
          </span>
        </div>
      </div>
      <LoginRequiredModal
        isModalOpen={isModalOpen}
        handleCancel={handleCancelModal}
      />
    </div>
  );
};

export default ReviewSpace;
