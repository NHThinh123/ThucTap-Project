import { useMutation, useQueryClient } from "@tanstack/react-query";
import { togglePauseHistoryApi } from "../services/historyApi";

const useTogglePauseHistory = () => {
  const queryClient = useQueryClient();

  const { mutate, isLoading, isError, error, isSuccess } = useMutation({
    mutationFn: (userId) => togglePauseHistoryApi(userId),
    onSuccess: () => {
      // Invalidate hoặc refetch các query liên quan nếu cần
      queryClient.invalidateQueries(["histories"]);
    },
    onError: (error) => {
      console.error("Error toggling pause history:", error);
    },
  });

  return {
    togglePauseHistory: mutate,
    isLoading,
    isError,
    error,
    isSuccess,
  };
};

export default useTogglePauseHistory;
