import VideoSearchGrid from "../features/video/components/templates/VideoSearchGrid";
import useVideo from "../features/video/hooks/useVideo";

const SearchResultPage = () => {
  const { videoData } = useVideo();
  return <VideoSearchGrid videos={videoData} />;
};

export default SearchResultPage;
