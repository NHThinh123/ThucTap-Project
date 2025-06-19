import { useMutation } from "@tanstack/react-query";
import { updateWatchDurationApi } from "../services/historyApi";

const useUpdateWatchDuration = () => {
  const {
    mutate: updateWatchDuration,
    isLoading,
    isError,
    error,
    isSuccess,
    data,
  } = useMutation({
    mutationFn: ({ id, watch_duration }) =>
      updateWatchDurationApi(id, watch_duration),
  });

  return {
    updateWatchDuration,
    isLoading,
    isError,
    error,
    isSuccess,
    data,
  };
};

export default useUpdateWatchDuration;
