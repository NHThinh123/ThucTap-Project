import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Typography } from "antd";
import { formatTime } from "../../../../constants/formatTime";
import { formatViews } from "../../../../constants/formatViews";
import { Link } from "react-router-dom";

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

  return (
    <>
      {/* Chèn CSS tùy chỉnh dựa trên số lượng video */}
      <style>{arrowStyles(videos.length)}</style>
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
                  <Link to={`/watch/${video._id}`}>
                    <img
                      src={video.thumbnail_video}
                      alt={video.title}
                      style={{
                        width: videos.length >= 5 ? "100%" : "220px", // Width động
                        height: "120px",
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                  </Link>
                  <div
                    style={{
                      marginTop: "8px",
                      width: videos.length >= 5 ? "100%" : "220px",
                    }}
                  >
                    <Link to={`/watch/${video._id}`}>
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

export default HorizontalListVideo;
