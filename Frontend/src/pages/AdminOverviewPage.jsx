import { Typography } from "antd";
import AllVideoList from "../features/admin/components/templates/AllVideoList";
import { useContext } from "react";
import { AuthContext } from "../contexts/auth.context";

const AdminOverviewPage = () => {
  const { auth } = useContext(AuthContext);
  if (!auth?.user) {
    return (
      <Typography.Text>
        Vui lòng đăng nhập để truy cập trang này.
      </Typography.Text>
    );
  }

  // Kiểm tra quyền admin
  if (auth.user.role !== "admin") {
    return (
      <Typography.Text>Bạn không có quyền truy cập trang này.</Typography.Text>
    );
  }

  return (
    <>
      <Typography.Title level={3} style={{ margin: "20px 0" }}>
        Danh sách tất cả video
      </Typography.Title>
      <AllVideoList /> {/* Không truyền userId */}
    </>
  );
};

export default AdminOverviewPage;
