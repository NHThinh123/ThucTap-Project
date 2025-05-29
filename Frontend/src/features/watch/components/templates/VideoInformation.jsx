import { Row, Typography } from "antd";
import VideoDescription from "../organisms/VideoDescription";
import ChannelInVideo from "../organisms/ChannelInVideo";
import InteractButton from "../organisms/InteractButton";
import ReviewSpace from "../../../review/components/templates/ReviewSpace";
const { Title } = Typography;

const VideoInformation = ({ video, isLoading }) => {
  return (
    <>
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
      <div>
        <ChannelInVideo channelId={video.user_id._id} />
        <InteractButton />
      </div>
      <ReviewSpace />
      <VideoDescription video={video} isLoading={isLoading} />
    </>
  );
};

export default VideoInformation;
