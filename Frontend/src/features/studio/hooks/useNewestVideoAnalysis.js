import { useQuery } from "@tanstack/react-query";
import { getNewestVideoAnalysis } from "../services/statsApi";

export const useNewestVideoAnalysis = ({ userId }) => {
  return useQuery({
    queryKey: ["newestVideoAnalysis", userId],
    queryFn: async () => {
      const response = await getNewestVideoAnalysis({ userId });
      return response; // Trả về dữ liệu từ API
    },

    retry: 1,
  });
};
