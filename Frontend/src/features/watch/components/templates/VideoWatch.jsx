import { useEffect, useRef, useState } from "react";
import useIncrementView from "../../../video/hooks/useIncrementView";

const VideoWatch = ({ video }) => {
  const { incrementView, isLoading } = useIncrementView();

  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const playerContainerRef = useRef(null);
  const volumeSliderRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const lastUpdateTimeRef = useRef(0);
  const saveHistoryTimeoutRef = useRef(null);
  const watchTimeRef = useRef(0);

  const [isPlaying, setIsPlaying] = useState(false);
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
  const saveWatchHistory = () => {
    if (!video?._id || watchTimeRef.current <= 0) return;

    const watchHistory = JSON.parse(
      localStorage.getItem("watchHistory") || "[]"
    );
    const historyItem = {
      _id: video._id,
      video_url: video.video_url,
      watchTime: watchTimeRef.current,
      currentTime: videoRef.current?.currentTime || 0,
      timestamp: new Date().toISOString(),
    };
    watchHistory.push(historyItem);
    localStorage.setItem("watchHistory", JSON.stringify(watchHistory));
    console.log("Lịch sử xem đã được lưu:", historyItem);
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
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
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

  // Xử lý ẩn/hiện controls và cursor
  const handleMouseActivity = () => {
    // Hiển thị controls và cursor
    setShowControls(true);
    setIsCursorHidden(false);

    // Clear timeout cũ
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    // Chỉ ẩn khi video đang phát
    if (isPlaying) {
      hideTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setIsCursorHidden(true);
      }, 3000);
    }
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

  // Theo dõi sự kiện di chuột - SỬA LẠI
  useEffect(() => {
    const container = playerContainerRef.current;
    if (!container) return;

    const handleMouseMove = () => {
      handleMouseActivity();
    };

    const handleMouseEnter = () => {
      setShowControls(true);
      setIsCursorHidden(false);
    };

    const handleMouseLeave = () => {
      // Khi chuột rời khỏi video, ẩn controls nếu đang phát
      if (isPlaying) {
        setShowControls(false);
        setIsCursorHidden(true);
      }
      // Clear timeout
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  // Xử lý khi trạng thái phát thay đổi - THÊM MỚI
  useEffect(() => {
    if (!isPlaying) {
      // Khi video dừng, hiện controls và cursor
      setShowControls(true);
      setIsCursorHidden(false);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    } else {
      // Khi video phát, bắt đầu timer ẩn controls
      handleMouseActivity();
    }
  }, [isPlaying]);

  // Theo dõi thời gian xem video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (!isDragging) {
        const currentTime = video.currentTime;
        setCurrentTime(currentTime);

        // Cập nhật watchTime chỉ khi video đang phát
        if (isPlaying && lastUpdateTimeRef.current > 0) {
          const deltaTime = currentTime - lastUpdateTimeRef.current;
          if (deltaTime > 0 && deltaTime < 2) {
            watchTimeRef.current += deltaTime;
            setWatchTime(watchTimeRef.current);
          }
        }
        lastUpdateTimeRef.current = currentTime;
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      console.log("Video duration: ", video.duration);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      lastUpdateTimeRef.current = video.currentTime;

      // Lưu lịch sử sau 5 giây kể từ khi bắt đầu phát
      if (saveHistoryTimeoutRef.current) {
        clearTimeout(saveHistoryTimeoutRef.current);
      }
      saveHistoryTimeoutRef.current = setTimeout(() => {
        saveWatchHistory();
      }, 5000);
    };

    const handlePause = () => {
      setIsPlaying(false);
      saveWatchHistory();
    };

    const handleEnded = () => {
      setIsPlaying(false);
      saveWatchHistory();
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
        clearTimeout(saveHistoryTimeoutRef.current);
      }
    };
  }, [isDragging, isPlaying]);

  // Kiểm tra thời gian xem để tăng lượt view
  useEffect(() => {
    if (!video?._id || !video?.user_id._id || hasIncrementedView) return;

    // Điều kiện tăng view:
    // 1. Video >= 30s: xem đủ 30s
    // 2. Video < 30s: xem hết video (currentTime >= duration - 1)
    const shouldIncrementView =
      (duration >= VIEW_THRESHOLD && watchTime >= VIEW_THRESHOLD) ||
      (duration < VIEW_THRESHOLD &&
        currentTime >= duration - 1 &&
        duration > 0);

    if (shouldIncrementView && video?._id && video?.user_id._id) {
      incrementView({ user_id: video.user_id._id, video_id: video._id });
      setHasIncrementedView(true);
      console.log(
        `View tăng: ${
          duration < VIEW_THRESHOLD ? "Video ngắn xem hết" : "Video dài xem 30s"
        }`
      );
    }
  }, [watchTime, currentTime, duration, hasIncrementedView, video]);

  // Lưu lịch sử định kỳ
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying && watchTime > 0) {
        saveWatchHistory();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isPlaying, watchTime]);

  // Reset khi video thay đổi
  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setWatchTime(0);
    setHasIncrementedView(false);
    watchTimeRef.current = 0;
    lastUpdateTimeRef.current = 0;

    if (saveHistoryTimeoutRef.current) {
      clearTimeout(saveHistoryTimeoutRef.current);
    }
  }, [video?.video_url]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      saveWatchHistory();
    };
  }, []);

  if (isLoading) return;

  return (
    <div
      ref={playerContainerRef}
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

          {/* Overlay điều khiển */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "linear-gradient(transparent, rgba(0, 0, 0, 0.8))",
              padding: "20px",
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
                height: "6px",
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                cursor: "pointer",
                borderRadius: "3px",
                marginBottom: "15px",
                position: "relative",
              }}
              onMouseDown={handleProgressMouseDown}
            >
              <div
                style={{
                  height: "100%",
                  backgroundColor: "#ff0000",
                  borderRadius: "3px",
                  width: `${(currentTime / duration) * 100 || 0}%`,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: "14px",
                    height: "14px",
                    backgroundColor: "#ff0000",
                    borderRadius: "50%",
                    position: "absolute",
                    right: "-7px",
                    top: "-4px",
                    transform: isDragging ? "scale(1.2)" : "scale(0)",
                    transition: "transform 0.2s",
                    border: "2px solid white",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
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
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(255, 255, 255, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "none";
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
                      volumeSliderRef.current.style.width = "80px";
                      volumeSliderRef.current.style.marginLeft = "10px";
                      volumeSliderRef.current.style.opacity = "1";
                    }
                  }}
                  onMouseLeave={() => {
                    if (volumeSliderRef.current) {
                      volumeSliderRef.current.style.width = "0";
                      volumeSliderRef.current.style.marginLeft = "0";
                      volumeSliderRef.current.style.opacity = "0";
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
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "rgba(255, 255, 255, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "none";
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
                      height: "4px",
                      backgroundColor: "rgba(255, 255, 255, 0.3)",
                      borderRadius: "2px",
                      transition: "width 0.3s, opacity 0.3s",
                      overflow: "hidden",
                      marginLeft: "0",
                      cursor: "pointer",
                      opacity: "0",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        backgroundColor: "white",
                        width: `${volume * 100}%`,
                        borderRadius: "2px",
                      }}
                    ></div>
                  </div>
                </div>

                {/* Hiển thị thời gian */}
                <div
                  style={{
                    color: "white",
                    fontSize: "14px",
                    margin: "0 15px",
                    fontWeight: "500",
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
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(255, 255, 255, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "none";
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
            fontSize: "18px",
          }}
        >
          <p>Đang tải video...</p>
        </div>
      )}
    </div>
  );
};

export default VideoWatch;
