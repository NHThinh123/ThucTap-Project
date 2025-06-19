import { useMutation } from "@tanstack/react-query";
import { deleteHistoryApi } from "../services/historyApi";

const useDeleteHistory = () => {
  const {
    mutate: deleteHistory,
    isLoading,
    isError,
    error,
    isSuccess,
    data,
  } = useMutation({
    mutationFn: deleteHistoryApi,
  });

  return {
    deleteHistory,
    isLoading,
    isError,
    error,
    isSuccess,
    data,
  };
};

export default useDeleteHistory;
