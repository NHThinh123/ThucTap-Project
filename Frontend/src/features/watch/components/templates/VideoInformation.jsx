import {
  DislikeOutlined,
  LikeOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Divider, Space } from "antd";

const VideoInformation = () => {
  return (
    <>
      <div>
        <div>
          <p level={3}>Video Title</p>
        </div>
        <div className="video-info">
          <Space className="channel-info">
            <Avatar src="https://i.pravatar.cc/40?img=4" />
            <div>
              <p strong>Channel Name</p>
              <br />
              <p type="secondary">100K subscribers</p>
            </div>
            <Button type="primary" shape="round">
              Subscribe
            </Button>
          </Space>
          <Space className="video-actions">
            <Button icon={<LikeOutlined />} shape="round">
              1.2K
            </Button>
            <Button icon={<DislikeOutlined />} shape="round">
              50
            </Button>
            <Button icon={<ShareAltOutlined />} shape="round">
              Share
            </Button>
          </Space>
        </div>
        <Card className="description-card">
          <p type="secondary">Published on May 13, 2025</p>
          <p style={{ marginTop: "8px" }}>
            This is the video description. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua.
          </p>
        </Card>
        <Divider />
      </div>
    </>
  );
};

export default VideoInformation;
