import React, { useContext } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Typography } from "antd";
import { formatTime } from "../../../../constants/formatTime";
import { formatViews } from "../../../../constants/formatViews";
import { Link } from "react-router-dom";
import { formatDuration } from "../../../../constants/formatDuration";
import useHistory from "../../../history/hooks/useHistory";
import { AuthContext } from "../../../../contexts/auth.context";

// CSS tùy chỉnh cho mũi tên và căn trái video
const arrowStyles = (videoCount) => `
  .slick-prev, .slick-next {
    width: 40px;
    height: 40px;
    background: #fff;
    border-radius: 50%;
    z-index: 100;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    top: 50% !important;
    transform: translateY(-100%);
  }

  .slick-prev:hover, .slick-next:hover {
    background: #f0f0f0;
  }

  .slick-prev {
    left: -5px;
  }

  .slick-next {
    right: -5px;
  }

  .slick-prev:before, .slick-next:before {
    font-size: 24px;
    color: #000;
  }

  .video-grid {
    display: flex;
    justify-content: flex-start;
    gap: 16px;
    flex-wrap: nowrap;
  }

  /* Căn trái các slide */
  .slick-track {
    display: flex !important;
    justify-content: flex-start !important;
  }

  /* Đặt kích thước cho slide dựa trên số lượng video */
  .slick-slide > div {
    width: 240px !important;
    margin-right: 4px !important;
  }
`;

const { Title, Text } = Typography;

const HorizontalListVideo = ({ videos = [] }) => {
  const { auth } = useContext(AuthContext);
  const { HistoryData, isLoading } = useHistory(auth?.user?.id);

  // Hàm tìm watch_duration từ HistoryData theo video.id
  const getWatchDuration = (videoId) => {
    if (!HistoryData?.data?.histories) return 0;

    for (const history of HistoryData.data.histories) {
      for (const vid of history.videos) {
        if (vid?.video_id?._id === videoId) {
          return vid?.watch_duration;
        }
      }
    }
    return 0;
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: Math.min(videos.length, 5), // Không vượt quá số video thực tế
    slidesToScroll: 2,
    arrows: true,
    variableWidth: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(videos.length, 3),
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(videos.length, 2),
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  if (isLoading) return null;

  return (
    <>
      {/* Chèn CSS tùy chỉnh dựa trên số lượng video */}
      <style>{arrowStyles(videos.length)}</style>
      <style>{styles}</style>
      <div
        className="slider-container"
        style={{
          padding: videos.length >= 5 ? "0 8px" : 0,
          maxWidth: "100%",
          overflow: "hidden",
        }}
      >
        {videos.length === 0 ? (
          <Text>Không có video nào để hiển thị.</Text>
        ) : (
          <Slider {...settings}>
            {videos.map((video) => (
              <div key={video._id}>
                <div style={{ marginRight: 16 }}>
                  <Link
                    to={`/watch/${video._id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = `/watch/${video._id}`;
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        borderRadius: 10,
                        overflow: "hidden",
                        objectFit: "cover",
                      }}
                    >
                      <img
                        src={video.thumbnail_video}
                        alt={video.title}
                        style={{
                          width: videos.length >= 5 ? "100%" : "220px", // Width động
                          height: "120px",
                          objectFit: "cover",
                        }}
                      />
                      <div className="video-card__duration">
                        {formatDuration(video?.duration)}
                      </div>
                      {getWatchDuration(video?._id) !== 0 && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            height: 5,
                            backgroundColor: "red",
                            width: `${Math.min(
                              (getWatchDuration(video._id) / video?.duration) *
                                100,
                              100
                            )}%`,
                          }}
                        />
                      )}
                    </div>
                  </Link>
                  <div
                    style={{
                      marginTop: "8px",
                      width: videos.length >= 5 ? "100%" : "220px",
                    }}
                  >
                    <Link
                      to={`/watch/${video._id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = `/watch/${video._id}`;
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "sans-serif",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          margin: 0,
                          fontWeight: "700",
                          color: "#0f0f0f",
                          fontSize: 14,
                        }}
                      >
                        {video.title}
                      </p>
                    </Link>
                    <p style={{ fontSize: "13px", marginTop: 5 }}>
                      {formatViews(video.views)} lượt xem •{" "}
                      {formatTime(video.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        )}
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
  }

  .video-card__duration {
    position: absolute;
    bottom: 6px;
    right: 6px;
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
  height: auto; 
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: 10px;
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
export default HorizontalListVideo;
