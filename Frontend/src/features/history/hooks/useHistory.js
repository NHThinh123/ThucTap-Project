import { useQuery } from "@tanstack/react-query";
import { getAllHistoriesOfUserApi } from "../services/historyApi";

const useHistory = (userId) => {
  const {
    data: HistoryData = {},
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userHistory", userId],
    queryFn: () => getAllHistoriesOfUserApi(userId),
  });

  return {
    HistoryData,
    isLoading,
    isError,
    error,
  };
};

export default useHistory;
