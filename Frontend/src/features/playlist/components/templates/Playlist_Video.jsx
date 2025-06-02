import React, { useState, useContext, useMemo } from "react";
import { List, Button, Spin, Modal } from "antd";
import { useUserPlaylists, useVideosInPlaylist } from "../../hooks/usePlayList";
import useVideoById from "../../hooks/useVideoById";
import { AuthContext } from "../../../../contexts/auth.context";

const PlayList_Video = () => {
  const { auth } = useContext(AuthContext);
  const user_id = auth?.user?.id;
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Lấy danh sách phát
  const { data: playlists, isLoading: isPlaylistsLoading } =
    useUserPlaylists(user_id);
  const safePlaylists = Array.isArray(playlists) ? playlists : [];

  // Lấy video trong danh sách phát được chọn
  const { data: playlistVideos, isLoading: isVideosLoading } =
    useVideosInPlaylist(selectedPlaylistId);

  // Sử dụng useMemo để đảm bảo videoIds ổn định
  const videoIds = useMemo(
    () => (playlistVideos ? playlistVideos.map((video) => video.video_id) : []),
    [playlistVideos]
  );

  // Gọi useVideoById cho từng videoId
  const videoQueries = useMemo(
    () => videoIds.map((videoId) => useVideoById(videoId)),
    [videoIds]
  );

  // Kết hợp video danh sách phát với chi tiết video
  const videoDetails = useMemo(
    () =>
      playlistVideos?.map((video, index) => ({
        ...video,
        videoData: videoQueries[index]?.videoData,
        isLoading: videoQueries[index]?.isLoading,
        isError: videoQueries[index]?.isError,
      })) || [],
    [playlistVideos, videoQueries]
  );

  const handleSelectPlaylist = (playlistId) => {
    setSelectedPlaylistId(playlistId);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedPlaylistId(null);
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

      <Modal
        title={
          safePlaylists.find((p) => p._id === selectedPlaylistId)
            ?.title_playlist || "Video trong danh sách phát"
        }
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Đóng
          </Button>,
        ]}
      >
        {isVideosLoading ? (
          <Spin tip="Đang tải video..." />
        ) : videoDetails.length === 0 ? (
          <div>Không có video trong danh sách phát này.</div>
        ) : (
          <List
            dataSource={videoDetails}
            renderItem={(video) => (
              <List.Item>
                {video.isLoading ? (
                  <Spin tip="Đang tải video..." />
                ) : video.isError ? (
                  <div>Lỗi khi tải video {video.video_id}</div>
                ) : (
                  <List.Item.Meta
                    title={video.videoData?.title || `Video ${video.video_id}`}
                    description={`Thứ tự: ${video.order}${
                      video.videoData?.description
                        ? ` | ${video.videoData.description}`
                        : ""
                    }`}
                  />
                )}
              </List.Item>
            )}
          />
        )}
      </Modal>
    </div>
  );
};

export default PlayList_Video;
