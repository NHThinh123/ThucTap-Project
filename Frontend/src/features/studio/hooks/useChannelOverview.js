import { useQuery } from "@tanstack/react-query";
import { getChannelOverview } from "../services/statsApi";

export const useChannelOverview = ({ userId }) => {
  return useQuery({
    queryKey: ["channelOverview", userId],
    queryFn: async () => {
      const response = await getChannelOverview({ userId });
      return response.data; // Trả về dữ liệu từ API
    },

    retry: 1,
  });
};
