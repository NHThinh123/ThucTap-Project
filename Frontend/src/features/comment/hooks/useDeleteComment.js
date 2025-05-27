import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCommentApi } from "../services/commentApi";

const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, user_id }) => deleteCommentApi(id, user_id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["videoComments", variables.video_id]);
    },
  });
};

export default useDeleteComment;
