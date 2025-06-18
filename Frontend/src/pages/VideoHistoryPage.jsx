import { useContext, useState } from "react";
import { AuthContext } from "../contexts/auth.context";
import useHistory from "../features/history/hooks/useHistory";
import VideoCardHistory from "../features/history/components/templates/VideoCardHistory";
import { Button, Col, Modal, Row, Spin, Typography } from "antd";
import { formatDateLabel } from "../constants/formatDateLabel";

const { Title } = Typography;

const VideoHistoryPage = () => {
  const { auth } = useContext(AuthContext);
  const { HistoryData, isLoading, isError } = useHistory(auth?.user.id);
  const DataLength = HistoryData?.data?.result;
  const Histories = HistoryData?.data?.histories;

  const [isClearModalVisible, setIsClearModalVisible] = useState(false);
  const [isPauseModalVisible, setIsPauseModalVisible] = useState(false);

  if (isLoading) return <Spin size="large" />;
  if (isError) return <div>Đã xảy ra lỗi khi tải lịch sử xem video.</div>;

  const handleClearHistory = () => {
    // Logic để xóa tất cả lịch sử xem video
    console.log("Xóa tất cả lịch sử xem video");
    setIsClearModalVisible(false);
  };

  const handlePauseHistory = () => {
    // Logic để tạm dừng lưu lịch sử xem video
    console.log("Tạm dừng lưu lịch sử xem video");
    setIsPauseModalVisible(false);
  };

  const showClearModal = () => {
    setIsClearModalVisible(true);
  };

  const showPauseModal = () => {
    setIsPauseModalVisible(true);
  };

  const handleClearCancel = () => {
    setIsClearModalVisible(false);
  };

  const handlePauseCancel = () => {
    setIsPauseModalVisible(false);
  };

  return (
    <div style={{ padding: "16px" }}>
      <Title level={2}>Lịch sử xem video</Title>
      {DataLength === 0 ? (
        <div>Không có dữ liệu lịch sử.</div>
      ) : (
        Histories.map((item) => (
          <div key={item.date} style={{ marginBottom: "32px" }}>
            <Title level={4}>{formatDateLabel(item.date)}</Title>
            <Row>
              <Col span={12}>
                {item.videos
                  .filter((videoItem) => videoItem.video_id !== null) // Bỏ video đã bị xóa
                  .map((videoItem) => (
                    <VideoCardHistory
                      key={videoItem._id}
                      video={videoItem.video_id}
                      watchDuration={videoItem.watch_duration} // truyền video đã populate
                    />
                  ))}
              </Col>
              <Col
                span={12}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  padding: "16px",
                  alignItems: "center",
                }}
              >
                <Row justify="start">
                  <Button
                    type="primary"
                    danger
                    onClick={showClearModal}
                    style={{
                      width: "200px",
                      height: "40px",
                      fontSize: "16px",
                      borderRadius: "8px",
                    }}
                  >
                    Xóa tất cả nhật ký xem
                  </Button>
                </Row>
                <Row justify="start">
                  <Button
                    type="default"
                    onClick={showPauseModal}
                    style={{
                      width: "200px",
                      height: "40px",
                      fontSize: "16px",
                      borderRadius: "8px",
                    }}
                  >
                    Tạm dừng lưu nhật ký xem
                  </Button>
                </Row>
              </Col>
            </Row>
          </div>
        ))
      )}
      <Modal
        title="Xác nhận xóa nhật ký xem"
        open={isClearModalVisible}
        onCancel={handleClearCancel}
        footer={[
          <Button key="cancel" onClick={handleClearCancel}>
            Hủy
          </Button>,
          <Button
            key="clear"
            type="primary"
            danger
            onClick={handleClearHistory}
          >
            Xóa nhật ký xem
          </Button>,
        ]}
      >
        <p>Bạn có chắc chắn muốn xóa tất cả nhật ký xem video không?</p>
      </Modal>

      <Modal
        title="Xác nhận tạm dừng lưu nhật ký xem"
        open={isPauseModalVisible}
        onCancel={handlePauseCancel}
        footer={[
          <Button key="cancel" onClick={handlePauseCancel}>
            Hủy
          </Button>,
          <Button key="pause" type="primary" onClick={handlePauseHistory}>
            Tạm dừng
          </Button>,
        ]}
      >
        <p>Bạn có chắc chắn muốn tạm dừng lưu nhật ký xem video không?</p>
      </Modal>
    </div>
  );
};

export default VideoHistoryPage;
