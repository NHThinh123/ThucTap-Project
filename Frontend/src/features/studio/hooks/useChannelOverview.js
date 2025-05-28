import { useQuery } from "@tanstack/react-query";
import { getChannelOverview } from "../services/statsApi";

export const useChannelOverview = ({ userId }) => {
  return useQuery({
    queryKey: ["channelOverview", userId],
    queryFn: async () => {
      const response = await getChannelOverview({ userId });
      return response.data; // Trả về dữ liệu từ API
    },
    staleTime: 5 * 60 * 1000, // Cache 5 phút
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
