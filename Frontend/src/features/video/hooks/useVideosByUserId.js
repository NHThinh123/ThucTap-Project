import { useQuery } from "@tanstack/react-query";
import { getVideosByUserIdApi } from "../services/videoApi";

const useVideosByUserId = (userId) => {
  const {
    data: videoList = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["videosByUserId", userId],
    queryFn: async () => {
      const response = await getVideosByUserIdApi(userId);
      return response.data?.videos || [];
    },
    onError: (err) => {
      console.error(`Error fetching videos for user ${userId}:`, err);
    },
    keepPreviousData: true,
    enabled: !!userId, // Chỉ chạy query khi userId tồn tại
  });

  return { videoList, isLoading, isError, error };
};

export default useVideosByUserId;
