import { Button } from "antd";
import { ChevronDown, ChevronUp } from "lucide-react";

const ShowHideReplyButton = ({ replyCount, onToggle, isExpanded }) => {
  return (
    <Button
      type="link"
      style={{
        padding: 0,
        fontSize: 14,
        color: "#1677ff",
        fontWeight: 520,
        marginTop: 4,
        width: "fit-content",
      }}
      onClick={onToggle}
    >
      {isExpanded ? (
        <ChevronUp strokeWidth={1.25} />
      ) : (
        <ChevronDown strokeWidth={1.25} />
      )}{" "}
      {replyCount} phản hồi
    </Button>
  );
};

export default ShowHideReplyButton;
