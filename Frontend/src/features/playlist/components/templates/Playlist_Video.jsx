import React, { useState, useContext } from "react";
import { List, Button, Spin, Modal, Card, Avatar } from "antd";
import {
  PlayCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  useUserPlaylists,
  useVideosInPlaylist,
  useDeletePlaylist,
  useRemoveVideoFromPlaylist,
} from "../../hooks/usePlayList";
import { useQueries } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../contexts/auth.context";
import { getVideoByIdApi } from "../../services/playListApi";

const PlayList_Video = () => {
  const { auth } = useContext(AuthContext);
  const user_id = auth?.user?.id;
  const navigate = useNavigate();
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeletePlaylistModalVisible, setIsDeletePlaylistModalVisible] =
    useState(false);
  const [isDeleteVideoModalVisible, setIsDeleteVideoModalVisible] =
    useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);
  const [videoToDelete, setVideoToDelete] = useState(null);

  // Lấy danh sách phát
  const {
    data: playlists,
    isLoading: isPlaylistsLoading,
    refetch: refetchPlaylists,
  } = useUserPlaylists(user_id);
  const safePlaylists = Array.isArray(playlists) ? playlists : [];

  // Lấy video trong danh sách phát được chọn
  const {
    data: playlistVideos,
    isLoading: isVideosLoading,
    refetch: refetchVideos,
  } = useVideosInPlaylist(selectedPlaylistId);
  const safePlaylistVideos = Array.isArray(playlistVideos)
    ? playlistVideos
    : [];

  // Hooks cho các thao tác xóa
  const { mutate: deletePlaylist } = useDeletePlaylist();
  const { mutate: removeVideo } = useRemoveVideoFromPlaylist();

  // Fetch chi tiết video
  const videoQueries = useQueries({
    queries: safePlaylistVideos.map((video) => ({
      queryKey: ["videos", video.video_id],
      queryFn: () => getVideoByIdApi(video.video_id),
      enabled: !!video.video_id && !!selectedPlaylistId,
    })),
  });

  // Kết hợp video danh sách phát với chi tiết video
  const videoDetails = safePlaylistVideos.map((video, index) => ({
    ...video,
    videoData: videoQueries[index]?.data,
    isLoading: videoQueries[index]?.isLoading,
    isError: videoQueries[index]?.isError,
  }));

  const handleSelectPlaylist = (playlistId) => {
    setSelectedPlaylistId(playlistId);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedPlaylistId(null);
  };

  const handleOpenDeletePlaylistModal = (playlistId) => {
    setPlaylistToDelete(playlistId);
    setIsDeletePlaylistModalVisible(true);
  };

  const handleCloseDeletePlaylistModal = () => {
    setIsDeletePlaylistModalVisible(false);
    setPlaylistToDelete(null);
  };

  const handleDeletePlaylist = () => {
    if (playlistToDelete) {
      console.log(
        "Xóa danh sách phát với ID:",
        playlistToDelete,
        "User ID:",
        user_id
      );
      deletePlaylist(
        { playlistId: playlistToDelete, userId: user_id },
        {
          onSuccess: () => {
            refetchPlaylists();
            if (selectedPlaylistId === playlistToDelete) {
              handleCloseModal();
            }
            handleCloseDeletePlaylistModal();
          },
        }
      );
    }
  };

  const handleOpenDeleteVideoModal = (videoId) => {
    setVideoToDelete(videoId);
    setIsDeleteVideoModalVisible(true);
  };

  const handleCloseDeleteVideoModal = () => {
    setIsDeleteVideoModalVisible(false);
    setVideoToDelete(null);
  };

  const handleRemoveVideo = () => {
    if (videoToDelete) {
      removeVideo(
        { playlistId: selectedPlaylistId, videoId: videoToDelete },
        {
          onSuccess: () => {
            refetchVideos();
            handleCloseDeleteVideoModal();
          },
        }
      );
    }
  };

  // Hàm chuyển đến trang phát video
  const handlePlayVideo = (videoId) => {
    navigate(`/watch/${videoId}`);
  };

  // Component hiển thị video item
  const VideoItem = ({ video }) => {
    if (video.isLoading) {
      return (
        <List.Item>
          <Spin tip="Đang tải video..." />
        </List.Item>
      );
    }

    if (video.isError) {
      return (
        <List.Item>
          <Card>
            <div style={{ color: "red" }}>
              Lỗi khi tải video {video.video_id}
            </div>
          </Card>
        </List.Item>
      );
    }

    const videoData = video.videoData;

    return (
      <List.Item
        actions={[
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleOpenDeleteVideoModal(video.video_id)}
          />,
        ]}
      >
        <Card
          hoverable
          style={{ width: "100%", marginBottom: 8 }}
          onClick={() => handlePlayVideo(video.video_id)}
        >
          <div style={{ display: "flex", gap: 16 }}>
            {/* Thumbnail */}
            <div style={{ minWidth: 160, height: 90, position: "relative" }}>
              {videoData?.thumbnail_video ? (
                <img
                  src={videoData.thumbnail_video}
                  alt={videoData.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 4,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 4,
                  }}
                >
                  <PlayCircleOutlined style={{ fontSize: 24, color: "#999" }} />
                </div>
              )}

              {/* Play overlay */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "rgba(0,0,0,0.7)",
                  borderRadius: "50%",
                  padding: 8,
                  cursor: "pointer",
                }}
              >
                <PlayCircleOutlined style={{ fontSize: 20, color: "white" }} />
              </div>

              {/* Duration */}
              {videoData?.duration && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 4,
                    right: 4,
                    backgroundColor: "rgba(0,0,0,0.8)",
                    color: "white",
                    padding: "2px 6px",
                    borderRadius: 2,
                    fontSize: 12,
                  }}
                >
                  {videoData.duration}
                </div>
              )}
            </div>

            {/* Video Info */}
            <div style={{ flex: 1 }}>
              <h4
                style={{
                  margin: "0 0 8px 0",
                  fontSize: 16,
                  fontWeight: 500,
                  lineHeight: 1.3,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {videoData?.title || `Video ${video.video_id}`}
              </h4>

              <div
                style={{
                  color: "#999",
                  fontSize: 12,
                  display: "flex",
                  gap: 12,
                }}
              >
                {videoData?.views && <span>{videoData.views} lượt xem</span>}
                {videoData?.uploadDate && (
                  <span>
                    <ClockCircleOutlined style={{ marginRight: 4 }} />
                    {videoData.uploadDate}
                  </span>
                )}
              </div>

              {videoData?.description && (
                <div
                  style={{
                    color: "#666",
                    fontSize: 13,
                    marginTop: 8,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {videoData.description}
                </div>
              )}
            </div>
          </div>
        </Card>
      </List.Item>
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Danh sách phát của bạn</h2>
      {isPlaylistsLoading ? (
        <Spin tip="Đang tải danh sách phát..." />
      ) : safePlaylists.length === 0 ? (
        <div>
          Không tìm thấy danh sách phát. Hãy tạo danh sách phát đầu tiên!
        </div>
      ) : (
        <List
          dataSource={safePlaylists}
          renderItem={(playlist) => (
            <List.Item
              actions={[
                <Button
                  type={
                    selectedPlaylistId === playlist._id ? "primary" : "default"
                  }
                  onClick={() => handleSelectPlaylist(playlist._id)}
                >
                  Xem
                </Button>,
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleOpenDeletePlaylistModal(playlist._id)}
                />,
              ]}
            >
              <List.Item.Meta
                title={playlist.title_playlist}
                description={playlist.description_playlist || "Không có mô tả"}
              />
            </List.Item>
          )}
        />
      )}

      {/* Modal for viewing playlist videos */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <PlayCircleOutlined />
            {safePlaylists.find((p) => p._id === selectedPlaylistId)
              ?.title_playlist || "Video trong danh sách phát"}
          </div>
        }
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Đóng
          </Button>,
        ]}
        width={800}
        style={{ top: 20 }}
      >
        {isVideosLoading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Spin size="large" tip="Đang tải danh sách video..." />
          </div>
        ) : videoDetails.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#999" }}>
            Không có video trong danh sách phát này.
          </div>
        ) : (
          <List
            dataSource={videoDetails}
            renderItem={(video) => <VideoItem video={video} />}
            style={{ maxHeight: 500, overflowY: "auto" }}
          />
        )}
      </Modal>

      <Modal
        title="Xác nhận xóa danh sách phát"
        open={isDeletePlaylistModalVisible}
        onOk={handleDeletePlaylist}
        onCancel={handleCloseDeletePlaylistModal}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc muốn xóa danh sách phát này?</p>
      </Modal>

      <Modal
        title="Xác nhận xóa video"
        open={isDeleteVideoModalVisible}
        onOk={handleRemoveVideo}
        onCancel={handleCloseDeleteVideoModal}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc muốn xóa video này khỏi danh sách phát?</p>
      </Modal>
    </div>
  );
};

export default PlayList_Video;
