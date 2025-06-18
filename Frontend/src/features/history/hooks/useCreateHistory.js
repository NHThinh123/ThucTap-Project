import { useMutation } from "@tanstack/react-query";
import { createHistoryApi } from "../services/historyApi";

const useCreateHistory = () => {
  const {
    mutate: createHistory,
    isLoading,
    isError,
    error,
    isSuccess,
    data,
  } = useMutation({
    mutationFn: createHistoryApi,
  });

  return {
    createHistory,
    isLoading,
    isError,
    error,
    isSuccess,
    data,
  };
};

export default useCreateHistory;
