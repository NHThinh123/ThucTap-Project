import { useMutation } from "@tanstack/react-query";
import { incrementViewApi } from "../services/videoApi";

const useIncrementView = () => {
  const {
    mutate: incrementView,
    isLoading,
    isError,
    isSuccess,
    data,
    error,
  } = useMutation({
    mutationFn: incrementViewApi,
  });

  return {
    incrementView,
    isLoading,
    isError,
    isSuccess,
    data,
    error,
  };
};

export default useIncrementView;
