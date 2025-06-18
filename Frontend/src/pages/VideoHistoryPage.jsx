import { useContext } from "react";
import { AuthContext } from "../contexts/auth.context";
import useHistory from "../features/history/hooks/useHistory";
import VideoCardHistory from "../features/history/components/templates/VideoCardHistory";
import { Col, Row, Spin, Typography } from "antd";
import { formatDateLabel } from "../constants/formatDateLabel";

const { Title } = Typography;

const VideoHistoryPage = () => {
  const { auth } = useContext(AuthContext);
  const { HistoryData, isLoading, isError } = useHistory(auth?.user.id);
  const DataLength = HistoryData?.data?.result;
  const Histories = HistoryData?.data?.histories;

  if (isLoading) return <Spin size="large" />;
  if (isError) return <div>Đã xảy ra lỗi khi tải lịch sử xem video.</div>;

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
              <Col span={12}></Col>
            </Row>
          </div>
        ))
      )}
    </div>
  );
};

export default VideoHistoryPage;
