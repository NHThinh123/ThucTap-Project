import { Typography } from "antd";

import VideoList from "../features/studio/components/templates/VideoList";
import { useContext } from "react";
import { AuthContext } from "../contexts/auth.context";

const StudioContentPage = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const userId = auth.user.id;
  return (
    <>
      <Typography.Title level={3} style={{ margin: "20px 0" }}>
        Nội dung của kênh
      </Typography.Title>
      <VideoList userId={userId} />
    </>
  );
};

export default StudioContentPage;
