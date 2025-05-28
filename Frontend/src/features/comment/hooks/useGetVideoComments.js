import { useQuery } from "@tanstack/react-query";
import { getVideoCommentsApi } from "../services/commentApi";

const useGetVideoComments = (videoId) => {
  return useQuery({
    queryKey: ["videoComments", videoId],
    queryFn: () =>
      getVideoCommentsApi(videoId).then((res) => res.data.comments),
    enabled: !!videoId, // Chỉ thực hiện truy vấn khi videoId có giá trị
    staleTime: 5 * 60 * 1000, // Dữ liệu được coi là "tươi" trong 5 phút
    cacheTime: 10 * 60 * 1000, // Dữ liệu được lưu trong cache 10 phút
  });
};

export default useGetVideoComments;
