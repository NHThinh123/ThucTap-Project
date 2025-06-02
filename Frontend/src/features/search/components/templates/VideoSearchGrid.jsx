import VideoSearchCard from "./VideoSearchCard";

const VideoSearchGrid = ({ videos }) => {
  if (!videos || !Array.isArray(videos)) return null;
  return (
    <>
      {videos.map((video) => (
        <VideoSearchCard video={video} />
      ))}
    </>
  );
};

export default VideoSearchGrid;
