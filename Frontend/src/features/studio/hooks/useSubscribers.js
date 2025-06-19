import { useQuery } from "@tanstack/react-query";
import { getSubscribers } from "../services/statsApi";

export const useSubscribers = ({ userId }) => {
  return useQuery({
    queryKey: ["Subscriber", userId],
    queryFn: async () => {
      const response = await getSubscribers({
        userId,
      });
      return response.data; // Trả về mảng data.data
    },

    retry: 1,
  });
};
