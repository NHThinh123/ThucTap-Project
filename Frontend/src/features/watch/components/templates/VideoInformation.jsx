import {
  DislikeOutlined,
  LikeOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Divider, Space, Typography } from "antd";
import { Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import VideoDescription from "./VideoDescription";
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
        <div>
          <Space>
            <Link to="/channel">
              <Avatar
                src="https://pbs.twimg.com/media/F_vO2geW0AE1mmW.jpg"
                size={45}
              />
            </Link>
            <div style={{ marginLeft: 5, fontSize: 14 }}>
              <Link to="/channel">
                <p
                  style={{
                    fontWeight: "bold",
                    fontSize: 15,
                    color: "#000",
                  }}
                >
                  KAFF Gaming
                </p>
              </Link>
              <p
                style={{
                  fontWeight: 400,
                  fontSize: 13,
                  color: "#606060",
                }}
              >
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
                height: 40,
                boxShadow: "none",
              }}
            >
              Đăng ký
            </Button>
          </Space>
          <Space style={{ float: "right" }}>
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
        <VideoDescription />
      </div>
    </>
  );
};

export default VideoInformation;
