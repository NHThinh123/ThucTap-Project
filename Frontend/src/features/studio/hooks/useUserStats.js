import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getUserStats } from "../services/statsApi";

export const useUserStats = ({ userId, period, startDate, endDate }) => {
  return useQuery({
    queryKey: ["userStats", userId, period, startDate, endDate],
    queryFn: async () => {
      const response = await getUserStats({
        userId,
        period,
        startDate,
        endDate,
      });
      return response.data; // Trả về mảng data.data
    },
    staleTime: 5 * 60 * 1000, // Cache 5 phút
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
