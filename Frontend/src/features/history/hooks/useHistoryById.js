import { useQuery } from "@tanstack/react-query";
import { getHistoryByIdApi } from "../services/historyApi";

const useHistoryById = (historyId) => {
  const {
    data: history = {},
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["historyById", historyId],
    queryFn: () => getHistoryByIdApi(historyId),
    enabled: !!historyId, // chỉ gọi khi có ID
  });

  return {
    history,
    isLoading,
    isError,
    error,
  };
};

export default useHistoryById;
