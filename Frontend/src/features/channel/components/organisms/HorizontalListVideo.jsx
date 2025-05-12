import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Typography } from "antd";

// Thêm CSS tùy chỉnh cho mũi tên
const arrowStyles = `
  .slick-prev, .slick-next {
    width: 40px;
    height: 40px;
    background: #fff;
    border-radius: 50%;
    z-index: 100;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Đổ bóng */
    display: flex;
    align-items: center;
    justify-content: center;
    top: 50% !important; /* Căn giữa theo chiều dọc */
    transform: translateY(-100%); /* Căn giữa tuyệt đối */
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
`;

const { Title, Text } = Typography;

const HorizontalListVideo = () => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 2,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
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

  const videos = Array.from({ length: 10 }, (_, index) => ({
    id: index,
    title: `Video Title ${index + 1}`,
    views: "100 N lượt xem",
    time: "1 tháng trước",
    thumbnail:
      "https://cdn.dribbble.com/userupload/12205471/file/original-6e438536dab71e35649e6c5ab9111f7e.png?format=webp&resize=400x300&vertical=center",
  }));

  return (
    <>
      {/* Chèn CSS tùy chỉnh */}
      <style>{arrowStyles}</style>
      <div
        className="slider-container"
        style={{
          padding: "0 8px",
          maxWidth: "100%", // Ngăn tràn container
          overflow: "hidden", // Ẩn nội dung tràn ra ngoài
        }}
      >
        <Slider {...settings}>
          {videos.map((video) => (
            <div key={video.id} style={{ padding: "0 16px" }}>
              <img
                src={video.thumbnail}
                alt="Thumbnail"
                style={{
                  width: "95%",
                  height: "150px",
                  borderRadius: "8px",
                  objectFit: "cover", // Đảm bảo hình ảnh tỷ lệ đúng
                }}
              />
              <div style={{ marginTop: "8px" }}>
                <Title level={5} style={{ margin: 0 }}>
                  {video.title}
                </Title>
                <Text>
                  {video.views} • {video.time}
                </Text>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

export default HorizontalListVideo;
