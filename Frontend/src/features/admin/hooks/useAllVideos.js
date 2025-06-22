import { useQuery } from "@tanstack/react-query";
import axios from "../../../services/axios.customize";

const fetchAllVideos = async () => {
  try {
    console.log("Fetching all videos");
    const response = await axios.get(`/api/video/admin/getAllVideo`);
    console.log("All videos response:", response.data);

    // Sửa lại để phù hợp với cấu trúc dữ liệu thực tế
    return response.data?.videos || response?.videos || [];
  } catch (error) {
    console.error("Fetch videos error:", error);
    console.error("Error details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Lỗi khi lấy danh sách video"
    );
  }
};

export const useAllVideos = () => {
  return useQuery({
    queryKey: ["allVideos"],
    queryFn: fetchAllVideos,
    retry: 2,
    retryDelay: 1000,
    onError: (error) => {
      console.error("Query error:", error);
    },
    onSuccess: (data) => {
      console.log("Query success:", data);
    },
  });
};
