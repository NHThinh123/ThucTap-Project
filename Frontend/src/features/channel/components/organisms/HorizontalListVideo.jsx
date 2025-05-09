import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Typography } from "antd";

const { Title, Text } = Typography;

const HorizontalListVideo = () => {
  const settings = {
    dots: true, // Hiển thị chấm điều hướng
    infinite: false, // Không lặp vô hạn
    speed: 500, // Tốc độ chuyển slide
    slidesToShow: 4, // Hiển thị 4 video cùng lúc
    slidesToScroll: 1, // Cuộn 1 video mỗi lần
    arrows: true, // Hiển thị mũi tên điều hướng
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

  // Dữ liệu mẫu cho video
  const videos = Array.from({ length: 10 }, (_, index) => ({
    id: index,
    title: `Video Title ${index + 1}`,
    views: "100 N lượt xem",
    time: "1 tháng trước",
    thumbnail:
      "https://cdn.dribbble.com/userupload/12205471/file/original-6e438536dab71e35649e6c5ab9111f7e.png?format=webp&resize=400x300&vertical=center",
  }));

  return (
    <div className="slider-container" style={{ padding: "0 8px" }}>
      <Slider {...settings}>
        {videos.map((video) => (
          <div key={video.id} style={{ padding: "0 8px" }}>
            <img
              src={video.thumbnail}
              alt="Thumbnail"
              style={{ width: "100%", height: "200px", borderRadius: "8px" }}
            />
            <div style={{ marginTop: "8px" }}>
              <Title level={4} style={{ margin: 0 }}>
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
  );
};

export default HorizontalListVideo;
