import { useLocation } from "react-router-dom";
import VideoSearchGrid from "../features/search/components/templates/VideoSearchGrid";
import useSearch from "../features/search/hooks/useSeach";
import { Spin } from "antd";
// import useVideo from "../features/video/hooks/useVideo";

const SearchResultPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");

  const { searchResults, isSearchLoading, isSearchError, searchError } =
    useSearch(query);

  console.log("video search: ", searchResults);

  if (!query) {
    return <p>Vui lòng nhập từ khóa tìm kiếm</p>;
  }

  if (isSearchLoading) {
    return (
      <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
    );
  }

  if (isSearchError) {
    return <p>Đã có lỗi xảy ra: {searchError.message}</p>;
  }
  // const { videoList } = useVideo();
  return <VideoSearchGrid videos={searchResults.data.videos || []} />;
};

export default SearchResultPage;
