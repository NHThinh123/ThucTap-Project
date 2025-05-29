import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReviewApi } from "../services/reviewApi";

const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReviewApi,
    onSuccess: (data) => {
      // data chứa thông tin review đã xóa kèm user info
      const deletedReview = data.data;
      queryClient.invalidateQueries(["videoReviews", deletedReview.video_id]);
      queryClient.invalidateQueries([
        "videoReviewsCount",
        deletedReview.video_id,
      ]);
      queryClient.invalidateQueries([
        "videoAverageRating",
        deletedReview.video_id,
      ]);
      queryClient.invalidateQueries([
        "userReviewForVideo",
        deletedReview.user_id,
        deletedReview.video_id,
      ]);
      queryClient.invalidateQueries(["userReviews", deletedReview.user_id]);
      queryClient.invalidateQueries(["review", deletedReview._id]);
    },
  });
};

export default useDeleteReview;
