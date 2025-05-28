import { Typography, Space } from "antd";
import VideoDescription from "../organisms/VideoDescription";
import ChannelInVideo from "../organisms/ChannelInVideo";
import InteractButton from "../organisms/InteractButton";
import { useContext } from "react";
import { AuthContext } from "../../../../contexts/auth.context";

const { Title } = Typography;

const VideoInformation = ({ video }) => {
  const { auth } = useContext(AuthContext);
  console.log("VideoInformation: video prop", { video });
  const videoId = video?._id;
  const userId = auth?.user?.id;

  if (!videoId) {
    console.error("VideoInformation: videoId is undefined");
  }
  if (!userId) {
    console.error("VideoInformation: userId is undefined");
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
          <ChannelInVideo />
          <InteractButton videoId={videoId} userId={userId} />
        </Space>
        <VideoDescription />
      </div>
    </>
  );
};

export default VideoInformation;
