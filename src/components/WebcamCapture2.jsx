import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";

// Define styled components for styling
const WebcamContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 100vw;
  margin: 0 auto;
`;

const WebcamVideo = styled.video`
  width: 100%;
  border-radius: 10px;
  @media (max-width: 767px) {
    height: auto;
    object-fit: cover;
    border-radius: 0;
  }
`;

const PreviewImg = styled.img`
  width: 100%;
  border-radius: 10px;
  @media (max-width: 767px) {
    height: auto;
    object-fit: cover;
    border-radius: 0;
  }
`;

const WebcamCanvas = styled.canvas`
  display: none; /* Hide canvas by default */
`;

const WebcamButton = styled.button`
  background-color: #026D44;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-right: 10px;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #02563a;
  }
`;

const WebcamCapture2 = ({ onCapture, id }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [mediaStream, setMediaStream] = useState(null);
  const [facingMode, setFacingMode] = useState("user"); // For toggling between front and back camera
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    startWebcam();
    return () => stopWebcam(); // Clean up on component unmount
  }, [facingMode]);

  useEffect(() => {
    if (capturedImage) {
      // localStorage.setItem(id, capturedImage);
      if (onCapture) {
        onCapture(id, capturedImage);
      }
    } else if (onCapture) {
      onCapture(null);
    }
  }, [capturedImage, onCapture]);

  // function saveImageData(key, data) {
  //   if (key === "base64" || key === "file") {
  //       // const imageData = { [key]: data };
  //       localStorage.setItem(key, data);
  //   } else {
  //       console.log("Invalid key. Use 'base64' or 'file' only.");
  //   }
  // }
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setMediaStream(stream);
    } catch (error) {
      console.error("Error accessing webcam", error);
    }
  };

  const stopWebcam = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context && video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageDataUrl = canvas.toDataURL("image/jpeg");
        setCapturedImage(imageDataUrl);
        // saveImageData("base64", imageDataUrl)
        stopWebcam();
      }
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setCapturedImage(reader.result);
      reader.readAsDataURL(file);
      // console.log("reader.readAsDataURL(file): ", reader.readAsDataURL(file));
      console.log("file: ", file);
      // saveImageData("file", file)
      stopWebcam();
    }
  };

  const toggleCamera = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
    stopWebcam();
  };

  const resetState = () => {
    stopWebcam();
    setCapturedImage(null);
    localStorage.removeItem("file");
    localStorage.removeItem("base64");
    startWebcam();
  };

  return (
    <WebcamContainer>
      {capturedImage ? (
        <>
          <PreviewImg src={capturedImage} alt="Captured" />
          <div className="flex justify-center items-center mt-4">
            <WebcamButton
              style={{
                backgroundColor: "red",
                color: "white",
                width: '30%',
                display: 'block',
                margin: '0 auto'
              }}
              onClick={resetState}
            >
              รีเซ็ตรูป
            </WebcamButton>
          </div>
        </>
      ) : (
        <>
          <div className="w-full h-auto bg-white md:w-full md:h-auto lg:w-full lg-h-auto">
            <WebcamVideo ref={videoRef} autoPlay muted />
            <WebcamCanvas ref={canvasRef} />
          </div>
          <div className="flex justify-center mt-4 space-x-2">
            <button onClick={toggleCamera} className="bg-blue-500 text-white p-2 rounded-full">
              <HiOutlineSwitchHorizontal size={20} />
            </button>
            <WebcamButton onClick={captureImage}>
              ถ่ายรูป
            </WebcamButton>
            <WebcamButton as="label" htmlFor="file-input">
              เลือกไฟล์
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                id="file-input"
                style={{ display: "none" }}
              />
            </WebcamButton>
          </div>
        </>
      )}
    </WebcamContainer>
  );
};

WebcamCapture2.propTypes = {
  onCapture: PropTypes.func.isRequired,
};

export default WebcamCapture2;
