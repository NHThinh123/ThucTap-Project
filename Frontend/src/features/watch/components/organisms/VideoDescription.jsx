import { useState } from "react";
import { formatViews } from "../../../../constants/formatViews";
import { formatTime } from "../../../../constants/formatTime";

const VideoDescription = ({ video, isLoading }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  if (isLoading || !video) {
    return (
      <div
        style={{
          borderRadius: 8,
          backgroundColor: "#f5f5f5",
          padding: 8,
          marginTop: 16,
          fontSize: 14,
          color: "#999",
        }}
      >
        Đang tải nội dung...
      </div>
    );
  }
  const description = video?.description_video;
  // const description =
  //   "This is the video description. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.This is the video description. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.This is the video description. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.This is the video description. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.This is the video";
  const charLimit = 150;

  const views = video?.views;
  const dateStr = video?.createdAt;
  const uploadDate = new Date(dateStr);

  // Hàm định dạng số lượt xem chi tiết
  const formatDetailedViews = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Hàm định dạng ngày tháng
  const formatDetailedDate = (date) => {
    return date
      .toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      .replace("thg ", "thg ");
  };

  const truncatedDescription =
    description.length > charLimit
      ? description.slice(0, charLimit) + "..."
      : description;
  return (
    <div
      style={{
        borderRadius: 8,
        backgroundColor: "#f5f5f5",
        padding: 8,
        marginTop: 16,
      }}
    >
      <div style={{ fontSize: 14, fontWeight: "bold", color: "#000" }}>
        <span>
          {isExpanded
            ? `${formatDetailedViews(views)} lượt xem`
            : `${formatViews(views)} lượt xem`}
        </span>
        <span style={{ marginLeft: 10 }}>
          {isExpanded ? formatDetailedDate(uploadDate) : formatTime(dateStr)}
        </span>
      </div>
      <div style={{ marginTop: 8, fontSize: 15, color: "#606060" }}>
        <p style={{ margin: 0, display: "inline" }}>
          {isExpanded ? description : truncatedDescription}
          {!isExpanded && description.length > charLimit && (
            <span
              style={{ color: "#000", cursor: "pointer", marginLeft: 5 }}
              onClick={() => setIsExpanded(true)}
            >
              Xem thêm
            </span>
          )}
        </p>
        {isExpanded && (
          <div>
            <span
              style={{
                color: "#000",
                cursor: "pointer",
                display: "block",
                marginTop: 4,
                width: "fit-content",
              }}
              onClick={() => setIsExpanded(false)}
            >
              Ẩn bớt
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
export default VideoDescription;
