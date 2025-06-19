import { List, Button } from "antd";
import { useAddVideoToPlaylist } from "../../hooks/usePlayList";
import { useModal } from "../../../../contexts/modal.context";
import CreatePlaylistForm from "../organisms/PlayListForm";

const PlaylistList = ({ playlists, videoId, isLoading, onCreatePlaylist }) => {
  const { mutate: addVideo, isPending } = useAddVideoToPlaylist();
  const { closeModal, openModal } = useModal();

  const handleAddToPlaylist = (playlistId) => {
    if (!playlistId || !videoId) {
      console.log("videoId trong PlaylistList:", videoId);
      console.error("Thiếu playlistId hoặc videoId", { playlistId, videoId });
      return;
    }

    // Đảm bảo cả hai ID là chuỗi hợp lệ
    const validPlaylistId = String(playlistId).trim();
    const validVideoId = String(videoId).trim();

    addVideo(
      {
        playlistId: validPlaylistId,
        videoId: validVideoId,
      },
      {
        onSuccess: closeModal,
        onError: (error) => {
          console.error("Lỗi thêm video:", error);
        },
      }
    );
  };

  const handleCreatePlaylistClick = () => {
    // Đóng modal hiện tại và mở modal mới với CreatePlaylistForm
    closeModal();
    openModal(
      <CreatePlaylistForm
        user_id={onCreatePlaylist.user_id}
        video_id={onCreatePlaylist.video_id}
      />
    );
  };

  if (isLoading) {
    return <List loading={true} />;
  }

  if (!Array.isArray(playlists)) {
    console.error("Playlists không phải là mảng:", playlists);
    return (
      <div>
        <div>Lỗi khi tải danh sách phát</div>
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Button type="primary" onClick={handleCreatePlaylistClick}>
            Tạo danh sách phát
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {playlists.length === 0 ? (
        <div>Không có danh sách phát</div>
      ) : (
        <div
          style={{ maxHeight: "300px", overflowY: "auto", marginBottom: 16 }}
        >
          <List
            loading={isPending}
            dataSource={playlists}
            renderItem={(playlist) => (
              <List.Item>
                <span>{playlist.title_playlist}</span>
                <Button
                  onClick={() => handleAddToPlaylist(playlist._id)}
                  disabled={!playlist._id || !videoId}
                >
                  Thêm
                </Button>
              </List.Item>
            )}
          />
        </div>
      )}
      <div style={{ textAlign: "center" }}>
        <Button type="primary" onClick={handleCreatePlaylistClick}>
          Tạo danh sách phát
        </Button>
      </div>
    </div>
  );
};

export default PlaylistList;
