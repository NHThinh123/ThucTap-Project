import { useQuery } from "@tanstack/react-query";
import { countVideoOfUserIdApi } from "../services/videoApi";

const useVideoCountByUserId = (userId) => {
  const {
    data: videoCount = 0,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["videoCountByUserId", userId],
    queryFn: async () => {
      const response = await countVideoOfUserIdApi(userId);
      // Trích xuất total từ response.data.total
      return response.data?.total || 0;
    },
    onError: (err) => {
      console.error(`Error fetching video count for user ${userId}:`, err);
    },
    keepPreviousData: true,
    enabled: !!userId, // Chỉ chạy query khi userId tồn tại
  });

  return { videoCount, isLoading, isError, error };
};

export default useVideoCountByUserId;
