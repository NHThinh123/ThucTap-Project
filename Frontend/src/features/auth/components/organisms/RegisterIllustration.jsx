import { Col } from "antd";
import image from "./../../../../assets/logo/logo.png";

const Illustration = () => {
  return (
    <Col
      xs={0}
      sm={0}
      md={12}
      lg={14}
      xl={16}
      style={{
        background: "linear-gradient(135deg, #e74c3c 0%, #e74c3c 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorative elements */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          animation: "float 6s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "60%",
          right: "15%",
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.05)",
          animation: "float 8s ease-in-out infinite reverse",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          left: "20%",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.08)",
          animation: "float 7s ease-in-out infinite",
        }}
      />

      {/* Main content */}
      <div
        style={{
          textAlign: "center",
          zIndex: 2,
          animation: "fadeInUp 1s ease-out",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            padding: "40px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            marginBottom: "30px",
          }}
        >
          <img
            src={image}
            alt="CUSCTube Logo"
            style={{
              maxWidth: "180px",
              height: "auto",
              transition: "transform 0.3s ease",
              filter: "brightness(1.1)",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05) rotate(5deg)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1) rotate(0deg)")}
          />
        </div>

        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: "900",
            color: "#fff",
            fontFamily: "'Poppins', sans-serif",
            marginBottom: "20px",
            textShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            letterSpacing: "2px",
          }}
        >
          CUSCTube
        </h1>

        <p
          style={{
            fontSize: "clamp(16px, 3vw, 20px)",
            color: "rgba(255, 255, 255, 0.9)",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: "300",
            margin: "0 20px",
            textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
            lineHeight: "1.6",
          }}
        >
          Nền tảng chia sẻ video
          <br />
          <span style={{ fontWeight: "500" }}>hiện đại và chuyên nghiệp</span>
        </p>

        <div
          style={{
            marginTop: "30px",
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "10px",
              padding: "15px 20px",
              backdropFilter: "blur(5px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <span style={{ color: "#fff", fontSize: "14px", fontWeight: "500" }}>
              🎬 Tải lên video
            </span>
          </div>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "10px",
              padding: "15px 20px",
              backdropFilter: "blur(5px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <span style={{ color: "#fff", fontSize: "14px", fontWeight: "500" }}>
              📺 Xem trực tuyến
            </span>
          </div>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "10px",
              padding: "15px 20px",
              backdropFilter: "blur(5px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <span style={{ color: "#fff", fontSize: "14px", fontWeight: "500" }}>
              💬 Tương tác
            </span>
          </div>
        </div>
      </div>

      {/* CSS Animation Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Col>
  );
};

export default Illustration;
