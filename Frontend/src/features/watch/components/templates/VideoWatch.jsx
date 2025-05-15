// import videoImg from "../../../../assets/background.jpg";

const VideoWatch = () => {
  return (
    <>
      <div style={{ width: "100%", height: "65vh" }}>
        {/* <img
          src={videoImg}
          alt=""
          style={{
            width: "100%",
            height: "65vh",
            borderRadius: 12,
            objectFit: "cover",
          }}
        /> */}
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/dIUTsFT2MeQ"
          title="Video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            borderRadius: 12,
            objectFit: "cover",
            border: "none",
          }}
        ></iframe>
      </div>
    </>
  );
};

export default VideoWatch;
