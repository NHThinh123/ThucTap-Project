import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCommentApi } from "../services/commentApi";

const useUpdateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, commentData }) => updateCommentApi(id, commentData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["comment", variables.id]);
      queryClient.invalidateQueries([
        "videoComments",
        variables.commentData.video_id,
      ]);
    },
  });
};

export default useUpdateComment;
