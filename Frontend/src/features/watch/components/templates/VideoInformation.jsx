import { Typography } from "antd";
import VideoDescription from "../organisms/VideoDescription";
import ChannelInVideo from "../organisms/ChannelInVideo";
import InteractButton from "../organisms/InteractButton";
const { Title } = Typography;

const VideoInformation = ({ video, isLoading }) => {
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
        <div>
          <ChannelInVideo />
          <InteractButton />
        </div>
        <VideoDescription video={video} isLoading={isLoading} />
      </div>
    </>
  );
};

export default VideoInformation;
