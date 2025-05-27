import { useQuery } from "@tanstack/react-query";
import { getNewestVideoAnalysis } from "../services/statsApi";

export const useNewestVideoAnalysis = ({ userId }) => {
  return useQuery({
    queryKey: ["newestVideoAnalysis", userId],
    queryFn: async () => {
      const response = await getNewestVideoAnalysis({ userId });
      return response; // Trả về dữ liệu từ API
    },
    staleTime: 5 * 60 * 1000, // Cache 5 phút
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
