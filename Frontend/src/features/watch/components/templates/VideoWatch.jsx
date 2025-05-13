import videoImg from "../../../../../public/assets/background.jpg";

const VideoWatch = () => {
  return (
    <>
      <style>
        {`
          .video-page-container {
            max-width: 1200px;
            margin: 0 auto;
          }
          .video-page-layout {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          .video-main {
            width: 100%;
          }
          .video-player {
            background-color: #f0f0f0;
            height: 384px;
            border-radius: 8px;
            margin-bottom: 16px;
            overflow: hidden;
          }
          .video-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
          }
          .channel-info {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .video-actions {
            display: flex;
            gap: 8px;
          }
          .description-card {
            padding: 16px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
          }
          .comments-section {
            margin-top: 16px;
          }
          .comment-input {
            margin-bottom: 16px;
          }
          .comment-input textarea {
            margin-bottom: 8px;
          }
          .suggested-videos {
            width: 100%;
          }
          .suggested-videos .ant-card {
            width: 100%;
            border-radius: 4px;
          }
          .suggested-videos .ant-card img {
            width: 100%;
            height: auto;
          }
          @media (min-width: 1024px) {
            .video-page-layout {
              flex-direction: row;
            }
            .video-main {
              width: 66.67%;
            }
            .suggested-videos {
              width: 33.33%;
            }
          }
        `}
      </style>
      <div style={{ width: "100%", height: "65vh" }}>
        <img
          src={videoImg}
          alt=""
          style={{ width: "100%", height: "65vh", borderRadius: 12 }}
        />
        {/* <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="Video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe> */}
      </div>
    </>
  );
};

export default VideoWatch;
