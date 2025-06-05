import { useQuery } from "@tanstack/react-query";
import axios from "../../../services/axios.customize";

const fetchUserVideos = async (userId) => {
  try {
    console.log("Fetching videos for user:", userId);
    const response = await axios.get(`/api/video/user/${userId}`);
    console.log("User videos response:", response.data);
    return response.data.videos || [];
  } catch (error) {
    console.error("Fetch user videos error:", error);
    throw new Error(
      error.response?.message || error.message || "Lỗi khi lấy danh sách video"
    );
  }
};

export const useUserVideos = (userId) => {
  return useQuery({
    queryKey: ["userVideos", userId],
    queryFn: () => fetchUserVideos(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};
