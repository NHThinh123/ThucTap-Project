import VideoSearchCard from "./VideoSearchCard";

const VideoSearchGrid = ({ videos }) => {
  return (
    <>
      {videos.map((video) => (
        <VideoSearchCard video={video} />
      ))}
    </>
  );
};

export default VideoSearchGrid;
