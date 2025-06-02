import { Typography, Space } from "antd";
import VideoDescription from "../organisms/VideoDescription";
import ChannelInVideo from "../organisms/ChannelInVideo";
import InteractButton from "../organisms/InteractButton";
import { ModalProvider } from "../../../../contexts/modal.context";
import ReviewSpace from "../../../review/components/templates/ReviewSpace";

const { Title } = Typography;

const VideoInformation = ({ video, isLoading }) => {
  const channelId = video?.user_id._id;
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div>
        <Typography>
          <Title
            style={{
              margin: 0,
              fontWeight: 600,
              fontSize: 25,
              padding: "16px 0",
            }}
          >
            {video?.title}
          </Title>
        </Typography>
        <Space>
          <ModalProvider>
            <ChannelInVideo channelId={channelId} />
            <InteractButton />
          </ModalProvider>
        </Space>
      </div>
      <ReviewSpace />
      <VideoDescription video={video} isLoading={isLoading} />
    </>
  );
};

export default VideoInformation;
