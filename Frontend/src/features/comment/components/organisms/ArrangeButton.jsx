import { Button, Dropdown, Menu } from "antd";
import { ChartBarDecreasing } from "lucide-react";

const ArrangeButton = ({ onSortChange, sortType }) => {
  const menu = (
    <Menu
      onClick={({ key }) => onSortChange(key)}
      items={[
        {
          key: "newest",
          label: "Mới nhất xếp trước",
          style:
            sortType === "newest"
              ? {
                  background: "rgb(196, 196, 196)",
                  margin: 8,
                }
              : {},
        },
        {
          key: "oldest",
          label: "Cũ nhất xếp trước",
          style:
            sortType === "oldest"
              ? {
                  background: "rgb(196, 196, 196)",
                  margin: 8,
                }
              : {},
        },
      ]}
    />
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Button
        type="default"
        style={{
          fontSize: 14,
          border: "none",
          padding: 0,
          display: "flex",
          alignItems: "center",
        }}
      >
        <ChartBarDecreasing size={25} strokeWidth={1} />
        Sắp xếp theo
      </Button>
    </Dropdown>
  );
};

export default ArrangeButton;
