import { useContext, useEffect, useRef, useState } from "react";
import useIncrementView from "../../../video/hooks/useIncrementView";
import { AuthContext } from "../../../../contexts/auth.context";
import useCreateHistory from "../../../history/hooks/useCreateHistory";
import useUpdateWatchDuration from "../../../history/hooks/useUpdateWatchDuration";
import useHistory from "../../../history/hooks/useHistory";
import { useLocation } from "react-router-dom";

const VideoWatch = ({ video }) => {
  const location = useLocation();
  const { auth } = useContext(AuthContext);
  const userId = auth?.user?.id;
  const { incrementView, isLoading } = useIncrementView();
  const [historyId, setHistoryId] = useState(null);
  const [hasCreatedHistory, setHasCreatedHistory] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: "100%",
    height: "auto",
  });
  const { createHistory } = useCreateHistory();
  const { updateWatchDuration } = useUpdateWatchDuration();
  const { HistoryData, isLoading: isLoadingHistory } = useHistory(userId);

  const videoRef = useRef(null);
  const prevPathRef = useRef(location.pathname);
  const progressRef = useRef(null);
  const playerContainerRef = useRef(null);
  const volumeSliderRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const lastUpdateTimeRef = useRef(0);
  const saveHistoryTimeoutRef = useRef(null);
  const watchTimeRef = useRef(0);
  const isCreatingHistoryRef = useRef(false);

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

  useEffect(() => {
    if (!userId || isLoadingHistory || !HistoryData?.data?.histories) return;

    let found = null;
    for (const group of HistoryData.data.histories) {
      for (const item of group.videos) {
        if (item.video_id?._id === video._id) {
          found = item;
          break;
        }
      }
      if (found) break;
    }

    if (found) {
      setHistoryId(found._id);
      setHasCreatedHistory(true);
      if (found.watch_duration > 0) {
        videoRef.current.currentTime = found.watch_duration;
        console.log("Tua đến thời gian đã xem:", found.watch_duration);
      }
    }
  }, [HistoryData, isLoadingHistory, video?._id]);

  // Hàm xác định kích thước dựa trên breakpoint
  const updateDimensions = () => {
    const width = window.innerWidth;

    // Breakpoints của Ant Design
    const breakpoints = {
      xs: 576,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1600,
    };

    // Logic thay đổi kích thước dựa trên màn hình
    if (width < breakpoints.sm) {
      // xs: < 576px
      setDimensions({ width: "100%", height: "270px" }); // Ví dụ: chiều cao nhỏ
    } else if (width < breakpoints.md) {
      // sm: ≥ 576px và < 768px
      setDimensions({ width: "100%", height: "350px" });
    } else if (width < breakpoints.lg) {
      // md: ≥ 768px và < 992px
      setDimensions({ width: "100%", height: "410px" });
    } else if (width < breakpoints.xl) {
      // lg: ≥ 992px và < 1200px
      setDimensions({ width: "100%", height: "460px" });
    } else if (width < breakpoints.xxl) {
      // xl: ≥ 1200px và < 1600px
      setDimensions({ width: "100%", height: "450px" });
    } else {
      // xxl: ≥ 1600px
      setDimensions({ width: "100%", height: "460px" });
    }
  };

  // Theo dõi thay đổi kích thước màn hình
  useEffect(() => {
    updateDimensions(); // Cập nhật lần đầu khi component mount
    window.addEventListener("resize", updateDimensions); // Cập nhật khi resize

    return () => {
      window.removeEventListener("resize", updateDimensions); // Cleanup
    };
  }, []);

  const saveWatchHistory = () => {
    if (!userId || isLoadingHistory) return;
    const current = videoRef.current?.currentTime || 0;
    if (!video?._id || current <= 0) return;

    const payload = {
      user_id: userId,
      video_id: video._id,
      watch_duration: current,
    };

    if (!hasCreatedHistory) {
      isCreatingHistoryRef.current = true;
      if (!userId || isLoadingHistory) return;
      createHistory(payload, {
        onSuccess: (data) => {
          setHistoryId(data?._id);
          setHasCreatedHistory(true);
          isCreatingHistoryRef.current = false;
          console.log("Đã tạo lịch sử:", data);
        },
        onError: (err) => {
          isCreatingHistoryRef.current = false;
          if (
            err?.response?.data?.message ===
            "This video already exists in the user's history"
          ) {
            // Nếu đã tồn tại thì chỉ cần update
            setHasCreatedHistory(true); // đánh dấu là đã từng tạo
          }
        },
      });
    } else if (historyId && current > 0) {
      if (!userId || isLoadingHistory) return;
      updateWatchDuration(
        {
          id: historyId,
          watch_duration: current,
        },
        {
          onSuccess: (data) => {
            console.log("Cập nhật thời lượng xem:", data);
          },
          onError: (err) => {
            console.error(
              "Lỗi cập nhật thời lượng xem:",
              err?.response?.data || err
            );
          },
        }
      );
    }
  };

  const formatTime = (time) => {
    if (!isFinite(time)) return "0:00";
    if (time < 60) {
      const seconds = Math.floor(time);
      return `0:${seconds < 10 ? "0" : ""}${seconds}`;
    } else if (time < 3600) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    } else {
      const hours = Math.floor(time / 3600);
      const minutes = Math.floor((time % 3600) / 60);
      const seconds = Math.floor(time % 60);
      return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
        seconds < 10 ? "0" : ""
      }${seconds}`;
    }
  };

  // Xử lý phát/tạm dừng video
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.muted = false;
      setIsMuted(false);
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
    };

    const handlePause = () => {
      setIsPlaying(false);
      saveWatchHistory();
    };

    const handleEnded = () => {
      setIsPlaying(false);
      // saveWatchHistory();
      clearInterval(saveHistoryTimeoutRef.current);
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

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || !video || !HistoryData?.data?.histories) return;

    let found = null;
    for (const group of HistoryData.data.histories) {
      for (const item of group.videos) {
        if (item.video_id && item.video_id._id === video._id) {
          found = item;
          break;
        }
      }
      if (found) break;
    }

    const handleLoadedMetadata = () => {
      const duration = videoEl.duration;
      console.log("Thời lượng video: ", duration);
      console.log("Thời lượng xem trong lịch sử: ", found?.watch_duration);
      console.log(
        "found?.watch_duration === duration: ",
        found?.watch_duration === duration
      );

      if (
        found?.watch_duration &&
        duration &&
        found.watch_duration === duration
      ) {
        videoEl.currentTime = 0;
        console.log("Reset thời lượng xem:", found.watch_duration);
        setWatchTime(0);
      } else if (
        found?.watch_duration > 0 &&
        duration &&
        found.watch_duration !== duration
      ) {
        videoEl.currentTime = found.watch_duration;
        console.log("Tua đến thời gian đã xem:", found.watch_duration);
        setWatchTime(0);
      }

      if (found?._id) {
        setHistoryId(found._id);
        setHasCreatedHistory(true);
      }
    };

    // Đăng ký sự kiện loadedmetadata
    videoEl.addEventListener("loadedmetadata", handleLoadedMetadata);

    // Kiểm tra nếu metadata đã được tải sẵn
    if (videoEl.readyState >= 1) {
      handleLoadedMetadata();
    }

    // Cleanup
    return () => {
      videoEl.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [HistoryData, video]);

  // Kiểm tra thời gian xem để tăng lượt view
  useEffect(() => {
    if (!userId || !video?._id || !video?.user_id?._id || hasIncrementedView)
      return;

    // Ngưỡng để tăng view: 70% thời lượng video
    const viewThreshold = duration * 0.7;

    // Điều kiện tăng view: watchTime đạt hoặc vượt 70% thời lượng video
    const shouldIncrementView = duration > 0 && watchTime >= viewThreshold;

    if (shouldIncrementView && video?._id && video?.user_id._id) {
      incrementView({ user_id: video.user_id._id, video_id: video._id });
      setHasIncrementedView(true);
      console.log(
        `View tăng: Đã xem ${Math.round((watchTime / duration) * 100)}% video`
      );
    }
  }, [watchTime, duration, hasIncrementedView, video]);

  // Lưu lịch sử định kỳ
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying && watchTime > 0) {
        saveWatchHistory();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isPlaying, watchTime]);

  useEffect(() => {
    return () => {
      saveWatchHistory(); // lưu lần cuối khi rời khỏi trang
    };
  }, [video?._id]);

  useEffect(() => {
    const prevPath = prevPathRef.current;
    const currentPath = location.pathname;

    const wasInWatch = prevPath.startsWith("/watch");
    const isNowOutsideWatch = !currentPath.startsWith("/watch");

    if (wasInWatch && isNowOutsideWatch) {
      //Đang rời khỏi /watch/... → reload trang
      saveWatchHistory();
      window.location.reload();
    }

    prevPathRef.current = currentPath;
  }, [location.pathname]);

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

  if (isLoading && isLoadingHistory) return;

  return (
    <div
      ref={playerContainerRef}
      style={{
        width: dimensions.width,
        height: dimensions.height,
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
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "12px",
              objectFit: "contain",
              objectPosition: "center",
              backgroundColor: "black",
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
              padding: "5px",
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
                marginBottom: "10px",
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
                marginBottom: "5px",
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
                    width: "30px",
                    height: "30px",
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
                      width: "30px",
                      height: "30px",
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
                    width: "30px",
                    height: "30px",
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
