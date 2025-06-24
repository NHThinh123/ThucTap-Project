import React, { useContext, useEffect, useState, useMemo } from "react";
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
import { debounce } from "lodash"; // Cần cài đặt lodash: npm install lodash

const { Title, Text } = Typography;

// CSS động dựa trên kích thước màn hình
const arrowStyles = (windowWidth) => `
  .slick-prev, .slick-next {
    width: ${windowWidth < 768 ? "24px" : "32px"};
    height: ${windowWidth < 768 ? "24px" : "32px"};
    background: #fff;
    border-radius: 50%;
    z-index: 100;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
   
    top: 40%;
    transform: translateY(-70%);
    transition: background 0.3s ease;
  }

  .slick-prev:hover, .slick-next:hover {
    background: #e0e0e0;
  }

  .slick-prev {
    left: -6px;
  }

  .slick-next {
    right: -6px;
  }

  .slick-prev:before, .slick-next:before {
    font-size: ${windowWidth < 768 ? "16px" : "20px"};
    color: #333;
  }

  .video-grid {
    display: flex;
    justify-content: flex-start;
    gap: ${windowWidth < 768 ? "8px" : "16px"};
    flex-wrap: nowrap;
  }

  .slick-track {
    display: flex !important;
    justify-content: flex-start !important;
  }

  .slick-slide > div {
    width: ${
      windowWidth < 768 ? "180px" : windowWidth < 1024 ? "200px" : "240px"
    } !important;
    margin-right: ${windowWidth < 768 ? "8px" : "12px"} !important;
  }

`;

const styles = `
  .video-card {
    width: 100%;
    cursor: pointer;
    border: none;
    padding: 0;
  }

  .video-card__thumbnail-container {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
  }

  .video-card__thumbnail {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
  }

  .video-card__duration {
    position: absolute;
    bottom: 6px;
    right: 6px;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    font-family: 'Roboto', sans-serif;
    font-size: 12px;
    font-weight: 510;
    padding: 2px 6px;
    border-radius: 4px;
  }

  .video-card__progress {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 4px;
    background-color: #f00;
    transition: width 0.3s ease;
  }

  .video-card__info {
    margin-top: 8px;
  }

  .video-card__title {
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #0f0f0f;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
    line-height: 1.4;
  }

  .video-card__meta {
    font-family: 'Roboto', sans-serif;
    font-size: 12px;
    color: #606060;
    margin-top: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 768px) {
    .video-card__title {
      font-size: 13px;
    }
    .video-card__meta {
      font-size: 11px;
    }
  }

  @media (max-width: 480px) {
    .video-card__title {
      font-size: 12px;
    }
    .video-card__meta {
      font-size: 10px;
    }
  }
`;

const HorizontalListVideo = ({ videos = [] }) => {
  const { auth } = useContext(AuthContext);
  const { HistoryData, isLoading } = useHistory(auth?.user?.id);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Debounce resize handler để tối ưu hiệu suất
  useEffect(() => {
    const handleResize = debounce(() => {
      setWindowWidth(window.innerWidth);
    }, 100);

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      handleResize.cancel(); // Hủy debounce khi unmount
    };
  }, []);

  // Memo hóa getWatchDuration để tránh tính toán lại
  const getWatchDuration = useMemo(() => {
    return (videoId) => {
      if (!HistoryData?.data?.histories) return 0;
      for (const history of HistoryData.data.histories) {
        for (const vid of history.videos) {
          if (vid?.video_id?._id === videoId) {
            return vid?.watch_duration || 0;
          }
        }
      }
      return 0;
    };
  }, [HistoryData]);

  // Cấu hình slider
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: Math.min(
      videos.length,
      windowWidth < 480 ? 1 : windowWidth < 768 ? 2 : windowWidth < 1024 ? 3 : 3
    ),
    slidesToScroll: 1,
    arrows: videos.length > (windowWidth < 480 ? 1 : windowWidth < 768 ? 2 : 3),
    variableWidth: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(videos.length, 3),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(videos.length, 2),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="slider-container" style={{ padding: "0 8px" }}>
        <Text>Đang tải...</Text>
      </div>
    );
  }

  return (
    <>
      <style>{arrowStyles(windowWidth)}</style>
      <style>{styles}</style>
      <div
        className="slider-container"
        style={{
          padding: videos.length > 3 ? "0 8px" : "0",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {videos.length === 0 ? (
          <Text>Không có video nào để hiển thị.</Text>
        ) : (
          <Slider {...settings}>
            {videos.map((video) => (
              <div key={video._id}>
                <div className="video-card">
                  <Link
                    to={`/watch/${video._id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = `/watch/${video._id}`;
                    }}
                  >
                    <div className="video-card__thumbnail-container">
                      <img
                        src={video.thumbnail_video}
                        alt={video.title}
                        className="video-card__thumbnail"
                      />
                      <div className="video-card__duration">
                        {formatDuration(video?.duration)}
                      </div>
                      {getWatchDuration(video?._id) !== 0 && (
                        <div
                          className="video-card__progress"
                          style={{
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
                  <div className="video-card__info">
                    <Link
                      to={`/watch/${video._id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = `/watch/${video._id}`;
                      }}
                    >
                      <p className="video-card__title">{video.title}</p>
                    </Link>
                    <p className="video-card__meta">
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

export default HorizontalListVideo;
