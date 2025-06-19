import { useLocation } from "react-router-dom";
import VideoSearchGrid from "../features/search/components/templates/VideoSearchGrid";
import useSearch from "../features/search/hooks/useSeach";
import { Spin, Typography } from "antd";
// import useVideo from "../features/video/hooks/useVideo";

const SearchResultPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");

  const { searchResults, isSearchLoading, isSearchError, searchError } =
    useSearch(query);

  if (!query) {
    return <p>Vui lòng nhập từ khóa tìm kiếm</p>;
  }

  if (isSearchLoading) {
    return (
      <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
    );
  }

  if (isSearchError) {
    return <p>Đã có lỗi xảy ra: {searchError?.message}</p>;
  }
  if (searchResults?.data?.videos?.length === 0)
    return (
      <Typography.Text
        type="secondary"
        style={{ display: "flex", justifyContent: "center" }}
      >
        Không tìm thấy video phù hợp
      </Typography.Text>
    );
  // const { videoList } = useVideo();
  return <VideoSearchGrid videos={searchResults?.data?.videos || []} />;
};

export default SearchResultPage;
