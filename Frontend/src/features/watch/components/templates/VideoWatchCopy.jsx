import { useEffect, useRef, useState } from "react";

const VideoWatch = ({ video }) => {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const playerContainerRef = useRef(null);
  const volumeSliderRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const lastUpdateTimeRef = useRef(0);
  const saveHistoryTimeoutRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isCursorHidden, setIsCursorHidden] = useState(false);
  const [watchTime, setWatchTime] = useState(0);
  const [hasIncrementedView, setHasIncrementedView] = useState(false);

  // Ngưỡng thời gian xem để tăng lượt view (30 giây)
  const VIEW_THRESHOLD = 30;

  // Lưu lịch sử xem vào localStorage
  const saveWatchHistory = (watchTime) => {
    const watchHistory = JSON.parse(
      localStorage.getItem("watchHistory") || "[]"
    );
    const historyItem = {
      _id: video?._id,
      video_url: video?.video_url,
      watchTime: watchTime,
      timestamp: new Date().toISOString(),
    };
    watchHistory.push(historyItem);
    localStorage.setItem("watchHistory", JSON.stringify(watchHistory));
    console.log("Lịch sử xem đã được lưu:", historyItem);
  };

  // Gửi yêu cầu tăng lượt view đến server
  const incrementViewCount = async () => {
    if (!video?._id || hasIncrementedView) return;

    try {
      // Giả định API endpoint để tăng lượt view
      const response = await fetch("/api/increment-view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId: video.id }),
      });
      if (response.ok) {
        setHasIncrementedView(true);
        console.log(`Lượt xem video ${video.id} đã được tăng`);
      }
    } catch (error) {
      console.error("Lỗi khi tăng lượt xem:", error);
    }
  };

  // Định dạng thời gian thành mm:ss
  const formatTime = (time) => {
    if (!isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Xử lý phát/tạm dừng video
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play();
      setIsPlaying(false);
    } else {
      video.pause();
      setIsPlaying(true);
    }
  };

  // Xử lý tắt/bật âm thanh
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  // Xử lý điều chỉnh âm lượng
  const handleVolumeChange = (e) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = volumeSliderRef.current.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    const newVolume = Math.max(0, Math.min(1, position));

    video.volume = newVolume;
    setVolume(newVolume);

    if (newVolume === 0) {
      video.muted = true;
      setIsMuted(true);
    } else if (video.muted) {
      video.muted = false;
      setIsMuted(false);
    }
  };

  // Xử lý chế độ toàn màn hình
  const toggleFullscreen = () => {
    const container = playerContainerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Xử lý thanh tiến trình
  const handleProgressChange = (e) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = progressRef.current.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    const newTime = position * video.duration;

    video.currentTime = Math.max(0, Math.min(video.duration, newTime));
    setCurrentTime(video.currentTime);
  };

  // Bắt đầu kéo thanh tiến trình
  const handleProgressMouseDown = (e) => {
    setIsDragging(true);
    handleProgressChange(e);

    document.addEventListener("mousemove", handleProgressMouseMove);
    document.addEventListener("mouseup", handleProgressMouseUp);
  };

  // Kéo thanh tiến trình
  const handleProgressMouseMove = (e) => {
    if (isDragging) {
      handleProgressChange(e);
    }
  };

  // Kết thúc kéo thanh tiến trình
  const handleProgressMouseUp = () => {
    setIsDragging(false);

    document.removeEventListener("mousemove", handleProgressMouseMove);
    document.removeEventListener("mouseup", handleProgressMouseUp);
  };

  // Theo dõi sự kiện fullscreenchange
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Theo dõi sự kiện di chuột vào/ra khỏi video
  useEffect(() => {
    const handleMouseMove = () => {
      // Mỗi lần di chuột thì hiện controls
      setShowControls(true);
      setIsCursorHidden(false);

      // Reset timeout
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }

      // Sau 3 giây không di chuột thì ẩn
      hideTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setIsCursorHidden(true);
      }, 3000);
    };

    const container = playerContainerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  // Theo dõi thời gian xem video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (!isDragging) {
        const currentTime = video.currentTime;
        // Cập nhật watchTime khi video đang phát
        if (isPlaying) {
          const deltaTime = currentTime - lastUpdateTimeRef.current;
          if (deltaTime > 0) {
            setWatchTime((prev) => prev + deltaTime);
          }
          lastUpdateTimeRef.current = currentTime;
        }
        setCurrentTime(currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      console.log("Video duration: ", video.duration);
      if (!isPlaying) {
        console.log("Chạy chỗ này");
        setIsPlaying(true);
        // Lưu lịch sử sau 5 giây kể từ khi phát tự động
        saveHistoryTimeoutRef.current = setTimeout(() => {
          saveWatchHistory(video.currentTime);
        }, 5000);
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
      saveWatchHistory(watchTime); // Lưu lịch sử khi tạm dừng
    };

    const handleEnded = () => {
      setIsPlaying(false);
      saveWatchHistory(watchTime); // Lưu lịch sử khi video kết thúc
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      if (saveHistoryTimeoutRef.current) {
        clearTimeout(saveHistoryTimeoutRef.current); // Dọn dẹp timeout
      }
    };
  }, [isDragging, isPlaying, watchTime]);

  // Kiểm tra thời gian xem để tăng lượt view
  useEffect(() => {
    if (watchTime >= VIEW_THRESHOLD && !hasIncrementedView) {
      incrementViewCount();
    }
    // Lưu lịch sử xem định kỳ (mỗi 5 giây)
    const interval = setInterval(() => {
      if (watchTime > 0) {
        saveWatchHistory(watchTime);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [watchTime, hasIncrementedView]);

  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setWatchTime(0);
    setHasIncrementedView(false);
    lastUpdateTimeRef.current = 0;
    if (saveHistoryTimeoutRef.current) {
      clearTimeout(saveHistoryTimeoutRef.current); // Dọn dẹp timeout khi video thay đổi
    }
  }, [video?.video_url]);

  return (
    <div
      ref={playerContainerRef}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      style={{
        width: "100%",
        height: "70vh",
        position: "relative",
        backgroundColor: "#000",
        overflow: "hidden",
        borderRadius: "12px",
        cursor: isCursorHidden ? "none" : "default",
      }}
    >
      {video?.video_url ? (
        <>
          <video
            ref={videoRef}
            src={video.video_url}
            autoPlay
            muted
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "12px",
              objectFit: "cover",
            }}
            onClick={togglePlay}
            onLoadedMetadata={(e) => {
              const video = e.target;
              setDuration(video.duration || 0);
            }}
            onTimeUpdate={(e) => {
              if (!isDragging) {
                const video = e.target;
                setCurrentTime(video.currentTime);
              }
            }}
            onEnded={() => setIsPlaying(false)}
          />

          {/* Hiển thị thời gian xem */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              color: "white",
              fontSize: "14px",
              background: "rgba(0, 0, 0, 0.5)",
              padding: "5px",
              borderRadius: "3px",
            }}
          >
            Thời gian xem: {formatTime(watchTime)}
          </div>

          {/* Overlay điều khiển */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "linear-gradient(transparent, rgba(0, 0, 0, 0.7))",
              padding: "10px",
              opacity: showControls ? 1 : 0,
              pointerEvents: showControls ? "auto" : "none",
              transition: "opacity 0.3s ease",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Thanh tiến trình */}
            <div
              ref={progressRef}
              style={{
                width: "100%",
                height: "5px",
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                cursor: "pointer",
                borderRadius: "3px",
                marginBottom: "10px",
                position: "relative",
              }}
              onMouseDown={handleProgressMouseDown}
            >
              <div
                style={{
                  height: "100%",
                  backgroundColor: "#f00",
                  borderRadius: "3px",
                  width: `${(currentTime / duration) * 100 || 0}%`,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    backgroundColor: "#f00",
                    borderRadius: "50%",
                    position: "absolute",
                    right: "-6px",
                    top: "-3.5px",
                    transform: isDragging ? "scale(1)" : "scale(0)",
                    transition: "transform 0.1s",
                  }}
                ></div>
              </div>
            </div>

            {/* Các nút điều khiển */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {/* Nút phát/tạm dừng */}
                <button
                  onClick={togglePlay}
                  style={{
                    background: "none",
                    border: "none",
                    color: "white",
                    margin: "0 5px",
                    cursor: "pointer",
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                  }}
                >
                  {isPlaying ? (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  ) : (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                {/* Điều khiển âm lượng */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                  }}
                  onMouseEnter={() => {
                    if (volumeSliderRef.current) {
                      volumeSliderRef.current.style.width = "60px";
                      volumeSliderRef.current.style.marginLeft = "10px";
                    }
                  }}
                  onMouseLeave={() => {
                    if (volumeSliderRef.current) {
                      volumeSliderRef.current.style.width = "0";
                      volumeSliderRef.current.style.marginLeft = "0";
                    }
                  }}
                >
                  <button
                    onClick={toggleMute}
                    style={{
                      background: "none",
                      border: "none",
                      color: "white",
                      margin: "0 5px",
                      cursor: "pointer",
                      width: "36px",
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                    }}
                  >
                    {isMuted || volume === 0 ? (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                      </svg>
                    ) : (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                      </svg>
                    )}
                  </button>

                  <div
                    ref={volumeSliderRef}
                    onClick={handleVolumeChange}
                    style={{
                      width: "0",
                      height: "3px",
                      backgroundColor: "rgba(255, 255, 255, 0.3)",
                      borderRadius: "3px",
                      transition: "width 0.3s",
                      overflow: "hidden",
                      marginLeft: "0",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        backgroundColor: "white",
                        width: `${volume * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Hiển thị thời gian */}
                <div
                  style={{
                    color: "white",
                    fontSize: "14px",
                    margin: "0 10px",
                  }}
                >
                  <span>{formatTime(currentTime)}</span> /{" "}
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <div>
                {/* Nút toàn màn hình */}
                <button
                  onClick={toggleFullscreen}
                  style={{
                    background: "none",
                    border: "none",
                    color: "white",
                    margin: "0 5px",
                    cursor: "pointer",
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                  }}
                >
                  {isFullscreen ? (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                    </svg>
                  ) : (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            color: "white",
          }}
        >
          <p>Đang tải video...</p>
        </div>
      )}
    </div>
  );
};

export default VideoWatch;
