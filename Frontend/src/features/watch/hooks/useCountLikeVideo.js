import { useQuery } from "@tanstack/react-query";
import { countLikeVideoApi } from "../services/user_like_videoApi"; // Đường dẫn tới file chứa countLikeVideoApi

const useCountLikeVideo = (video_id) => {
  return useQuery({
    queryKey: ["likeCount", video_id], // queryKey để cache, video_id làm phần duy nhất
    queryFn: async () => {
      try {
        const response = await countLikeVideoApi(video_id);
        return response.data; // Giả sử API trả về dữ liệu trong response.data
      } catch (error) {
        throw new Error("Lỗi khi lấy số lượng lượt thích: " + error.message);
      }
    },
    enabled: !!video_id, // Chỉ chạy query nếu video_id tồn tại
    staleTime: 5 * 60 * 1000, // Cache dữ liệu trong 5 phút
    cacheTime: 10 * 60 * 1000, // Giữ cache trong 10 phút
    refetchOnWindowFocus: false, // Không refetch khi window được focus
  });
};

export default useCountLikeVideo;
