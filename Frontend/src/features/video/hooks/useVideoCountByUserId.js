import { useQuery } from "@tanstack/react-query";
import { countVideoOfUserIdApi } from "../services/videoApi";

const useVideoCountByUserId = (userId) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["videoCountByUserId", userId],
    queryFn: async () => {
      const response = await countVideoOfUserIdApi(userId);
      return response;
    },
    onError: (err) => {
      console.error(`Error fetching video count for user ${userId}:`, err);
    },
    keepPreviousData: true,
    enabled: !!userId, // Chỉ chạy query khi userId tồn tại
  });

  return { data, isLoading, isError, error };
};

export default useVideoCountByUserId;
