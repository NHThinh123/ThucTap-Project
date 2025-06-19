import { useMutation } from "@tanstack/react-query";
import { deleteAllHistoriesApi } from "../services/historyApi";

const useDeleteAllHistories = () => {
  const {
    mutate: deleteAllHistories,
    isLoading,
    isError,
    error,
    isSuccess,
    data,
  } = useMutation({
    mutationFn: deleteAllHistoriesApi,
  });

  return {
    deleteAllHistories,
    isLoading,
    isError,
    error,
    isSuccess,
    data,
  };
};

export default useDeleteAllHistories;
