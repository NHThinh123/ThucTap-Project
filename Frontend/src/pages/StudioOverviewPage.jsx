import { Typography } from "antd";
import React from "react";
import BoxCustom from "../components/atoms/BoxCustom";

const StudioOverviewPage = () => {
  return (
    <>
      <Typography.Title level={3}>Tổng quan của kênh</Typography.Title>
      <BoxCustom>
        <Typography.Paragraph>
          Đây là nơi bạn có thể xem tổng quan về kênh của mình, bao gồm số lượng
          người đăng ký, lượt xem và các thông tin khác.
        </Typography.Paragraph>
        <Typography.Paragraph>
          Bạn cũng có thể truy cập các phần khác của YouTube Studio từ đây.
        </Typography.Paragraph>
      </BoxCustom>
    </>
  );
};

export default StudioOverviewPage;
