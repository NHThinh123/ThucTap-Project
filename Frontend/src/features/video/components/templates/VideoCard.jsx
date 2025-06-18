import { Link } from "react-router-dom";
import { formatTime } from "../../../../constants/formatTime";
import { formatViews } from "../../../../constants/formatViews";
import { formatDuration } from "../../../../constants/formatDuration";

const VideoCard = ({ video, isShow = true, watchDuration }) => {
  const handleCardClick = () => {
    window.location.href = `/watch/${video?._id}`; // Navigate to the video page
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
  };

  const handleLinkClick = (e) => {
    e.stopPropagation(); // Prevent parent onClick from firing
  };
  return (
    <>
      <style>{styles}</style>
      <div className="video-card" onClick={handleCardClick}>
        <div className="video-card__thumbnail-container">
          <img
            className="video-card__cover"
            src={video.thumbnail_video}
            alt={video.title}
          />
          <div className="video-card__duration">
            {formatDuration(video.duration)}
          </div>
          {watchDuration !== 0 && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                height: 5,
                backgroundColor: "red",
                width: `${Math.min(
                  (watchDuration / video.duration) * 100,
                  100
                )}%`,
              }}
            />
          )}
        </div>
        <div className="video-card__content">
          {isShow && (
            <Link
              to={`/channel/${video?.user_id?._id}`}
              className="video-card__avatar-link"
              onClick={handleLinkClick}
            >
              <img
                className="video-card__avatar"
                src={
                  video?.user_id?.avatar ||
                  "https://res.cloudinary.com/nienluan/image/upload/v1747707203/avaMacDinh_jxwsog.jpg"
                }
                alt="Channel avatar"
              />
            </Link>
          )}
          <div className="video-card__info">
            <div className="video-card__title-container">
              <div className="video-card__title">{video?.title}</div>
              <button
                className="video-card__more-btn"
                aria-label="More options"
              >
                <svg
                  className="video-card__more-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
            {isShow && (
              <Link
                to={`/channel/${video?.user_id?._id}`}
                className="video-card__channel-link"
                onClick={handleLinkClick}
              >
                <span className="video-card__channel">
                  {video?.user_id?.nickname || "Channel Name"}
                </span>
              </Link>
            )}
            <div className="video-card__meta">
              <span>{formatViews(video?.views)} lượt xem</span>
              <span className="dot">•</span>
              <span>{formatTime(video?.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = `
  .video-card {
    width: 100%;
    height: 100%;
    background: #fff;
    cursor: pointer;
    border: none;
    padding: 0;
  }

  .video-card__thumbnail-container {
    position: relative;
              border-radius: 10px;
              overflow: hidden;
              aspect-ratio: 16 / 9;
  }

  .video-card__duration {
    position: absolute;
    bottom: 12px;
    right: 8px;
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    font-family: 'Roboto', Arial, sans-serif;
    font-size: 12px;
    font-weight: 510;
    padding: 2px 6px;
    border-radius: 4px;
  }

  .video-card__cover {
  width: 100%;
  height: 100%
  object-fit: cover;
}

  .video-card__content {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding-top: 8px;
  }

  .video-card__avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }

  .video-card__info {
    flex: 1;
    min-width: 0;
  }
  .video-card__title-container {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
  }

  .video-card__title {
    font-family: 'Roboto', Arial, sans-serif;
    margin: 0;
    color: #0f0f0f;
    font-size: 17px;
    font-weight: 600;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
  }

  .video-card__more-btn {
    background: none;
    border: none;
    padding: 4px;
    display: flex;
    margin-right: -5px;
    cursor: pointer;
  }

  .video-card__more-btn:hover {
    background:rgb(196, 196, 196);
    border-color: black 1px solid;
    border-radius: 50%;
  }

  .video-card__more-icon {
    width: 20px;
    height: 20px;
    fill: #606060;
  }

  .video-card__channel {
  font-family: 'Roboto', Arial, sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: #606060;
  display: inline-block; /* Thay từ display: block */
  white-space: nowrap; /* Ngăn ngắt dòng để chiều dài đúng với nội dung */
}

  .video-card__meta {
  font-family: 'Roboto', Arial, sans-serif;
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 4px;
  }

  .video-card__meta span {
    font-weight: 400;
    font-size: 14px;
    color: #606060;
  }

  .video-card__meta .dot {
    line-height: 1;
  }
`;

export default VideoCard;
