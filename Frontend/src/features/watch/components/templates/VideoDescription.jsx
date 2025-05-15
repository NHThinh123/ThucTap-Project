import { useState } from "react";

const VideoDescription = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const description =
    "This is the video description. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.This is the video description. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.This is the video description. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.This is the video description. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.This is the video description. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.This is the video description. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.This is the video description. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
  const charLimit = 400; // Adjust this limit as needed

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
      <div style={{ fontSize: 14, fontWeight: "bold" }}>
        <span>10 Tr lượt xem</span>
        <span style={{ marginLeft: 10 }}>5 tháng trước</span>
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
