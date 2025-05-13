import {
  DislikeOutlined,
  LikeOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Divider, Space, Typography } from "antd";
import { Bookmark } from "lucide-react";
const { Title } = Typography;

const VideoInformation = () => {
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
            Tiêu đề Video
          </Title>
        </Typography>
        <div className="video-info">
          <Space className="channel-info">
            <Avatar
              src="https://pbs.twimg.com/media/F_vO2geW0AE1mmW.jpg"
              size={45}
            />
            <div style={{ marginLeft: 5, fontSize: 14 }}>
              <p
                style={{
                  marginBottom: 4,
                  fontWeight: "bold",
                  fontSize: 15,
                  color: "#000",
                }}
              >
                KAFF Gaming
              </p>
              <p style={{ fontWeight: 400, fontSize: 12, color: "#606060" }}>
                50 N người đăng ký
              </p>
            </div>
            <Button
              type="primary"
              shape="round"
              style={{
                color: "#fff",
                background: "#FF0000",
                border: "none",
                marginLeft: "20%",
                fontSize: 16,
                fontWeight: 500,
                padding: "0 20px",
                height: 35,
              }}
            >
              Đăng ký
            </Button>
          </Space>
          <Space className="video-actions">
            <div
              style={{
                border: "1px solid #d9d9d9",
                borderRadius: 50,
                // backgroundColor: "#606060",
              }}
            >
              <Button
                icon={<LikeOutlined />}
                style={{
                  border: "none",
                  boxShadow: "none",
                  padding: "0 5px 0 16px",
                }}
                size="large"
              >
                <p style={{ fontSize: 16, fontWeight: 500 }}>1,2 N</p>
              </Button>
              <Divider type="vertical" />
              <Button
                icon={<DislikeOutlined />}
                style={{
                  border: "none",
                  boxShadow: "none",
                  padding: "0 16px 0 5px",
                }}
                size="large"
              ></Button>
            </div>
            <div style={{ border: "1px solid #d9d9d9", borderRadius: 50 }}>
              <Button
                icon={<ShareAltOutlined />}
                style={{
                  border: "none",
                  boxShadow: "none",
                  padding: "0 16px 0 16px",
                }}
                size="large"
              >
                <p style={{ fontSize: 16, fontWeight: 500 }}>Chia sẻ</p>
              </Button>
            </div>
            <div style={{ border: "1px solid #d9d9d9", borderRadius: 50 }}>
              <Button
                icon={<Bookmark size={22} strokeWidth={1.75} />}
                style={{
                  border: "none",
                  boxShadow: "none",
                  padding: "0 16px 0 16px",
                }}
                size="large"
              >
                <p style={{ fontSize: 16, fontWeight: 500 }}>Lưu</p>
              </Button>
            </div>
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
