import { useQuery } from "@tanstack/react-query";
import { getVideoApi } from "../services/videoApi";

const useVideo = () => {
  const {
    data: videoList = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      const response = await getVideoApi();
      // Trích xuất mảng videos từ response.data.videos
      return response.data?.videos || [];
    },
    onError: (err) => {
      console.error("Error fetching videos:", err);
    },
    keepPreviousData: true,
  });

  return { videoList, isLoading, isError, error };
};

export default useVideo;
