import VideoSuggestCard from "./VideoSuggestCard";

const VideoSuggestGrid = ({ videos }) => {
  if (!videos || !Array.isArray(videos)) return null;
  return (
    <>
      {videos.map((video) => (
        <VideoSuggestCard video={video} />
      ))}
    </>
  );
};

export default VideoSuggestGrid;
