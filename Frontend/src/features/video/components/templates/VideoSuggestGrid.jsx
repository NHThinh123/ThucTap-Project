import VideoSuggestCard from "./VideoSuggestCard";

const VideoSuggestGrid = ({ videos }) => {
  return (
    <>
      {videos.map((video) => (
        <VideoSuggestCard video={video} />
      ))}
    </>
  );
};

export default VideoSuggestGrid;
