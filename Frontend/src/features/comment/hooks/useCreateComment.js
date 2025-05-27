import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCommentApi } from "../services/commentApi";

const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCommentApi,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["videoComments", variables.video_id]);
    },
  });
};

export default useCreateComment;
