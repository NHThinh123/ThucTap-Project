import VideoSearchGrid from "../features/search/components/templates/VideoSearchGrid";
import useVideo from "../features/video/hooks/useVideo";

const SearchResultPage = () => {
  const { videoList } = useVideo();
  return <VideoSearchGrid videos={videoList} />;
};

export default SearchResultPage;
