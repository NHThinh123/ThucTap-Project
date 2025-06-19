import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../contexts/auth.context";
import useHistory from "../features/history/hooks/useHistory";
import useDeleteAllHistories from "../features/history/hooks/useDeleteAllHistories";
import VideoCardHistory from "../features/history/components/templates/VideoCardHistory";
import { Button, Col, Modal, Row, Spin, Typography, message } from "antd";
import { formatDateLabel } from "../constants/formatDateLabel";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";

const { Title } = Typography;

const VideoHistoryPage = () => {
  const { auth } = useContext(AuthContext);
  console.log("auth in VideoHis: ", auth?.user);
  const { HistoryData, isLoading, isError } = useHistory(auth?.user?.id);
  const {
    deleteAllHistories,
    isLoading: isClearLoading,
    error: clearError,
  } = useDeleteAllHistories();
  const queryClient = useQueryClient();
  const [dataLength, setDataLength] = useState(HistoryData?.results || 0);
  const Histories = HistoryData?.data?.histories;

  const [isClearModalVisible, setIsClearModalVisible] = useState(false);

  // Cập nhật dataLength khi HistoryData thay đổi
  useEffect(() => {
    setDataLength(HistoryData?.results || 0);
  }, [HistoryData]);

  if (isLoading) return <Spin size="large" />;
  if (isError) return <div>Đã xảy ra lỗi khi tải lịch sử xem video.</div>;

  const handleClearHistory = () => {
    deleteAllHistories(auth?.user?.id, {
      onSuccess: () => {
        message.success("Xóa tất cả lịch sử xem thành công");
        setDataLength(0);
        queryClient.invalidateQueries(["histories", auth?.user?.id]);
        setIsClearModalVisible(false);
      },
      onError: () => {
        message.error(
          clearError?.message || "Đã xảy ra lỗi khi xóa lịch sử xem"
        );
      },
    });
  };

  const showClearModal = () => {
    setIsClearModalVisible(true);
  };

  const handleClearCancel = () => {
    setIsClearModalVisible(false);
  };

  return (
    <div style={{ padding: "16px" }}>
      <Row style={{}}>
        <Col span={6}>
          <Title level={2}>Lịch sử xem video</Title>
        </Col>
        <Col span={17}></Col>
        <Col span={1}>
          <Button
            type="primary"
            danger
            onClick={showClearModal}
            style={{
              width: "fit-content",
              height: "40px",
              fontSize: "16px",
              borderRadius: "8px",
              color: "#000",
              backgroundColor: "#fff",
              boxShadow: "none",
            }}
            loading={isClearLoading}
            disabled={isClearLoading}
          >
            <Trash2 />
          </Button>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          {dataLength === 0 ? (
            <div>Danh sách này không có video nào</div>
          ) : (
            Histories.map((item) => (
              <div key={item.date} style={{ marginBottom: "32px" }}>
                <Title level={4}>{formatDateLabel(item.date)}</Title>
                {item.videos
                  .filter((videoItem) => videoItem.video_id !== null) // Bỏ video đã bị xóa
                  .map((videoItem) => (
                    <VideoCardHistory
                      key={videoItem._id}
                      video={videoItem.video_id}
                      watchDuration={videoItem.watch_duration} // truyền video đã populate
                      historyId={videoItem._id}
                    />
                  ))}
              </div>
            ))
          )}
        </Col>
        <Col span={12}></Col>
      </Row>
      <Modal
        title="Xác nhận xóa nhật ký xem"
        open={isClearModalVisible}
        onCancel={handleClearCancel}
        footer={[
          <Button
            key="cancel"
            onClick={handleClearCancel}
            disabled={isClearLoading}
          >
            Hủy
          </Button>,
          <Button
            key="clear"
            type="primary"
            danger
            onClick={handleClearHistory}
            loading={isClearLoading}
            disabled={isClearLoading}
          >
            Xóa nhật ký xem
          </Button>,
        ]}
        style={{ top: 250 }}
        width={"30vw"}
      >
        <p>Bạn có chắc chắn muốn xóa tất cả nhật ký xem video không?</p>
      </Modal>
    </div>
  );
};

export default VideoHistoryPage;
