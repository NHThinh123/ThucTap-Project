import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrUpdateReviewApi } from "../services/reviewApi";

const useCreateOrUpdateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrUpdateReviewApi,
    onSuccess: (_, variables) => {
      // Invalidate các queries liên quan đến video
      queryClient.invalidateQueries(["videoReviews", variables.video_id]);
      queryClient.invalidateQueries(["videoReviewsCount", variables.video_id]);
      queryClient.invalidateQueries(["videoAverageRating", variables.video_id]);
      queryClient.invalidateQueries([
        "userReviewForVideo",
        variables.user_id,
        variables.video_id,
      ]);
      queryClient.invalidateQueries(["userReviews", variables.user_id]);
    },
  });
};

export default useCreateOrUpdateReview;
