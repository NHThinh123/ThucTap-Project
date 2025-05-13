import { Col } from "antd";
import image from "./../../../../assets/logo/logo.png";

const Illustration = () => {
    return (
        <Col
            xs={0}
            md={12}
            style={{
                textAlign: "center",
                padding: "50px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                animation: "fadeIn 1s ease-in",
            }}
        >
            <img
                src={image}
                alt="Yumzy Illustration"
                style={{
                    maxWidth: "70%",
                    height: "auto",
                    transition: "transform 0.3s",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            />
            <h1
                style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "#000",
                    fontFamily: "'Poppins', sans-serif",

                }}
            >
                TrueTube
            </h1>

        </Col>
    );
};

export default Illustration;