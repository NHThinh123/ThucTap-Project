import VideoWatch from "../features/watch/components/templates/VideoWatch";
import VideoInformation from "../features/watch/components/templates/VideoInformation";
import VideoComment from "../features/comment/components/templates/VideoComment";
import { Col, Row, Spin } from "antd";
import { useParams } from "react-router-dom";
import useVideoById from "../features/video/hooks/useVideoById";
import { useVideosInPlaylist } from "../features/playlist/hooks/usePlayList";
import { getVideoByIdApi } from "../features/video/services/videoApi";
import { useState, useEffect } from "react";
import PlaylistSuggestGrid from "../features/playlist/components/templates/PlaylistSuggestGrid";
import { useChannelVideo } from "../features/channel/hooks/useChannelVideo";
import VideoSuggestGrid from "../features/video/components/templates/VideoSuggestGrid";

const PlayListVideoPage = () => {
  const { playlistId, id } = useParams();
  const { data, isLoading, isError } = useVideosInPlaylist(playlistId);
  const { videoData, isLoading: isLoadingVideoById } = useVideoById(id);
  const { video } = videoData;
  const [videoList, setVideoList] = useState([]);
  const { data: normalVideos } = useChannelVideo();
  const normalList = normalVideos?.data.videos;

  // Fetch danh sách video từ playlist
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videos = await Promise.all(
          data?.map(async (item) => {
            const video = await getVideoByIdApi(item.video_id);
            return video.video;
          }) || []
        );
        setVideoList(videos);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách video:", error);
        setVideoList([]);
      }
    };

    if (data) {
      fetchVideos();
    }
  }, [data]);

  // Lọc video không nằm trong videoList
  const filteredVideoList = normalList?.filter(
    (video) =>
      !videoList.some((playlistVideo) => playlistVideo._id === video._id)
  );

  if (isLoading || isLoadingVideoById) return <Spin />;
  if (isError) return <p>Lỗi khi tải danh sách video.</p>;

  return (
    <>
      {/* Bố cục cho md trở xuống: mỗi thành phần chiếm toàn bộ chiều rộng */}
      <Row style={{ background: "#fff", padding: 0 }} gutter={[0, 0]}>
        <Col xs={24} sm={24} md={24} lg={0} xl={0} xxl={0}>
          <VideoWatch video={video} isLoading={isLoadingVideoById} />
        </Col>
        <Col xs={24} sm={24} md={24} lg={0} xl={0} xxl={0}>
          <VideoInformation video={video} isLoading={isLoadingVideoById} />
        </Col>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={0}
          xl={0}
          xxl={0}
          style={{ marginTop: "16px" }}
        >
          <PlaylistSuggestGrid videos={videoList} playlist_id={playlistId} />
        </Col>
        <Col xs={24} sm={24} md={24} lg={0} xl={0} xxl={0}>
          <VideoSuggestGrid videos={filteredVideoList} />
        </Col>
        <Col xs={24} sm={24} md={24} lg={0} xl={0} xxl={0}>
          <VideoComment video={video} isLoading={isLoadingVideoById} />
        </Col>
      </Row>

      {/* Bố cục cho lg: VideoWatch ở hàng 1, các thành phần khác ở hàng 2 */}
      <Row style={{ background: "#fff", padding: 0 }} gutter={[0, 0]}>
        <Col xs={0} sm={0} md={0} lg={24} xl={0} xxl={0}>
          <VideoWatch video={video} isLoading={isLoadingVideoById} />
        </Col>
      </Row>
      <Row style={{ background: "#fff", padding: 0 }} gutter={[0, 0]}>
        <Col
          xs={0}
          sm={0}
          md={0}
          lg={15}
          xl={0}
          xxl={0}
          style={{ padding: "0px 8px 0px 24px" }}
        >
          <VideoInformation video={video} isLoading={isLoadingVideoById} />
          <VideoComment video={video} isLoading={isLoadingVideoById} />
        </Col>
        <Col
          xs={0}
          sm={0}
          md={0}
          lg={9}
          xl={0}
          xxl={0}
          style={{ marginTop: "16px" }}
        >
          <PlaylistSuggestGrid videos={videoList} playlist_id={playlistId} />
          <div style={{ marginTop: "16px" }}>
            <VideoSuggestGrid videos={filteredVideoList} />
          </div>
        </Col>
      </Row>

      {/* Bố cục cho xl trở lên: tất cả thành phần ở cùng hàng */}
      <Row style={{ background: "#fff", padding: 0 }} gutter={[0, 0]}>
        <Col xs={0} sm={0} md={0} lg={0} xl={1} xxl={1}></Col>
        <Col
          xs={0}
          sm={0}
          md={0}
          lg={0}
          xl={15}
          xxl={15}
          style={{ padding: "0px 8px 0px 24px" }}
        >
          <VideoWatch video={video} isLoading={isLoadingVideoById} />
          <VideoInformation video={video} isLoading={isLoadingVideoById} />
          <VideoComment video={video} isLoading={isLoadingVideoById} />
        </Col>
        <Col xs={0} sm={0} md={0} lg={0} xl={7} xxl={7}>
          <PlaylistSuggestGrid videos={videoList} playlist_id={playlistId} />
          <div style={{ marginTop: "16px" }}>
            <VideoSuggestGrid videos={filteredVideoList} />
          </div>
        </Col>
        <Col xs={0} sm={0} md={0} lg={0} xl={1} xxl={1}></Col>
      </Row>
    </>
  );
};

export default PlayListVideoPage;
