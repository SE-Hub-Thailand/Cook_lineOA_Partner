import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import QrFrame from "../../assets/images/qr-frame.svg";
import TextModal from "../../components/TextModal";
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft } from "react-icons/hi"; // import ไอคอน back
import logo from "../../assets/images/logo.png";
import Header from "../../components/partner/Header";

const QrReader = () => {
  const navigate = useNavigate();
  const scanner = useRef(null);
  const videoEl = useRef(null);
  const qrBoxEl = useRef(null);
  const [qrOn, setQrOn] = useState(true);
  const [scannedResult, setScannedResult] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const onScanSuccess = (result) => {
    const scannedData = result?.data;
    console.log(scannedData);

    if (scannedData && scannedData.length === 10) {
      console.log(scannedData);

      setScannedResult(scannedData);
      setErrorMessage("");
      scanner.current?.stop();
      console.log("stop scannedData: ", scannedData);
      navigate('/partner/get-redeem/' + scannedData);
    } else {
      setErrorMessage("QR Code ไม่ถูกต้อง");
    }
  };

  const onScanFail = (err) => {
    console.log("Scanner error: ", err);
  };

  useEffect(() => {
    if (videoEl.current && !scanner.current) {
      scanner.current = new QrScanner(videoEl.current, onScanSuccess, {
        onDecodeError: onScanFail,
        preferredCamera: "environment",
        highlightScanRegion: true,
        highlightCodeOutline: true,
        overlay: qrBoxEl.current || undefined,
      });

      scanner.current
        .start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
        });
    }

    return () => {
      if (scanner.current) {
        scanner.current.stop();
        scanner.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!qrOn) {
      setShowModal(true);
    }
  }, [qrOn]);

  return (
    <>
      <Header />
      {showModal && (
        <TextModal message="Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload." />
      )}
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-yellow-100 via-pink-100 to-blue-100 relative">
        <div className="relative w-80 h-80 bg-white rounded-lg shadow-lg flex items-center justify-center">
          <video ref={videoEl} className="w-full h-full object-cover rounded-lg"></video>
          <div ref={qrBoxEl} className="absolute inset-0 flex justify-center items-center">
            <img
              src={QrFrame}
              alt="Qr Frame"
              width={256}
              height={256}
              className="absolute"
              style={{ transform: "translate(-50%, -50%)", top: "50%", left: "50%" }}
            />
          </div>
        </div>

        {scannedResult ? (
          <p className="mt-6 text-center text-green-500 font-semibold">
            Scanned Result: {scannedResult}
          </p>
        ) : (
          errorMessage && (
            <p className="mt-6 text-center text-red-500 font-semibold">
              {errorMessage}
            </p>
          )
        )}

        <p className="mt-8 text-center text-gray-700">
          สแกนคิวอาร์โค้ดเพื่อใช้ฟีเจอร์ต่าง ๆ เช่น ค้นหารายการแลกแต้มเพื่อส่งสินค้าตามรายการให้ลูกค้า
        </p>
      </div>
    </>
  );
};

export default QrReader;
