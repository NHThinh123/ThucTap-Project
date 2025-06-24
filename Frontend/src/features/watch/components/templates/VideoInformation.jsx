import { Typography, Space, Row, Col } from "antd";
import VideoDescription from "../organisms/VideoDescription";
import ChannelInVideo from "../organisms/ChannelInVideo";
import InteractButton from "../organisms/InteractButton";
import { ModalProvider } from "../../../../contexts/modal.context";
import ReviewSpace from "../../../review/components/templates/ReviewSpace";

const { Title } = Typography;

const VideoInformation = ({ video, isLoading }) => {
  const channelId = video?.user_id?._id;
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Typography>
        <Title
          style={{
            margin: 0,
            fontWeight: 600,
            fontSize: 22,
            padding: "16px 0",
          }}
        >
          {video?.title}
        </Title>
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <ModalProvider>
          <ChannelInVideo channelId={channelId} />
          <InteractButton />
        </ModalProvider>
      </div>
      <ReviewSpace />
      <VideoDescription video={video} isLoading={isLoading} />
    </>
  );
};

export default VideoInformation;
