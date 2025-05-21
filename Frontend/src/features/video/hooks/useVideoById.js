import { useQuery } from "@tanstack/react-query";
import { getVideoByIdApi } from "../services/videoApi";

const useVideoById = (id) => {
  const {
    data: videoData = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["videos", id],
    queryFn: () => getVideoByIdApi(id),
  });

  return { videoData, isLoading, isError };
};

export default useVideoById;
