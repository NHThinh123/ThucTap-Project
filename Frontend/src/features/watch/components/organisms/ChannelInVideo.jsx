import { Avatar, Button, Space } from "antd";
import { Link } from "react-router-dom";
import SubscribeButton from "../molecules/SubscribeButton";

const ChannelInVideo = () => {
  return (
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
      <SubscribeButton />
    </Space>
  );
};

export default ChannelInVideo;
