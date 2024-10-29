import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QrScanner from 'react-qr-scanner';

const ScanQRCode = () => {
  const [scannedCode, setScannedCode] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleScan = (data) => {
    if (data) {
      setScannedCode(data);
      setErrorMessage(''); // เคลียร์ข้อความแจ้งเตือนเมื่อสแกนสำเร็จ
      // ตรวจสอบว่ารหัสถูกต้องหรือไม่
      if (isValidQRCode(data)) {
        const generatedCode = generateRandomCode(10);
        // นำไปยังหน้า /home พร้อมกับส่งรหัสไปใน state
        navigate('/home', { state: { code: generatedCode } });
      } else {
        setErrorMessage('QR Code ไม่ถูกต้อง');
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  // ฟังก์ชันตรวจสอบ QR Code ว่าถูกต้องหรือไม่
  const isValidQRCode = (code) => {
    return code.length === 10; // ตัวอย่างเงื่อนไข
  };

  // ฟังก์ชันสร้างรหัสสุ่ม
  const generateRandomCode = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  // กำหนดการตั้งค่าของ QrScanner
  const previewStyle = {
    height: 240,
    width: 240,
    borderRadius: '12px',
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      alert('อัปโหลดรูปภาพสำหรับการสแกน');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-yellow-100 via-pink-100 to-blue-100">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <button className="absolute top-2 right-2 text-gray-600 text-2xl focus:outline-none">
          &times;
        </button>
        <QrScanner
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={previewStyle}
          className="mx-auto"
        />
        <div className="flex items-center justify-center mt-6">
          <button className="flex items-center px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-shadow shadow-md">
            <span className="mr-2">คิวอาร์โค้ดของฉัน</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
          <label className="ml-4 flex items-center px-4 py-2 rounded-full bg-blue-400 text-white cursor-pointer hover:bg-blue-500 transition-shadow shadow-md">
            <span className="mr-2">แกลเลอรี่</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 8h16M4 16h16M12 4l-8 8m0 0l8 8m-8-8h16"
              />
            </svg>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
        {errorMessage && (
          <p className="mt-4 text-center text-red-500">{errorMessage}</p>
        )}
        <p className="text-center mt-6 text-gray-700">
          สแกนคิวอาร์โค้ดเพื่อใช้ฟีเจอร์ต่าง ๆ เช่น เพิ่มเพื่อน หรือใช้บริการ LINE
          Pay และ LINE BK
        </p>
      </div>
    </div>
  );
};

export default ScanQRCode;
// import { useEffect, useRef, useState } from "react";

// // Styles
// // import "./QrStyles.css";

// // Qr Scanner
// import QrScanner from "qr-scanner";
// // import QrFrame from "../assets/qr-frame.svg";

// const ScanQRCode = () => {
//   // QR States
//   const scanner = useRef(null);
//   const videoEl = useRef(null);
//   const qrBoxEl = useRef(null);
//   const [qrOn, setQrOn] = useState(true);

//   // Result
//   const [scannedResult, setScannedResult] = useState("");

//   // Success
//   const onScanSuccess = (result) => {
//     // 🖨 Print the "result" to browser console.
//     console.log(result);
//     // ✅ Handle success.
//     // 😎 You can do whatever you want with the scanned result.
//     setScannedResult(result?.data);
//   };

//   // Fail
//   const onScanFail = (err) => {
//     // 🖨 Print the "err" to browser console.
//     console.log(err);
//   };

//   useEffect(() => {
//     if (videoEl.current && !scanner.current) {
//       // 👉 Instantiate the QR Scanner
//       scanner.current = new QrScanner(videoEl.current, onScanSuccess, {
//         onDecodeError: onScanFail,
//         // 📷 This is the camera facing mode. In mobile devices, "environment" means back camera and "user" means front camera.
//         preferredCamera: "environment",
//         // 🖼 This will help us position our "QrFrame.svg" so that user can only scan when qr code is put in between our QrFrame.svg.
//         highlightScanRegion: true,
//         // 🔥 This will produce a yellow (default color) outline around the qr code that we scan, showing a proof that our qr-scanner is scanning that qr code.
//         highlightCodeOutline: true,
//         // 📦 A custom div which will pair with "highlightScanRegion" option above 👆. This gives us full control over our scan region.
//         overlay: qrBoxEl.current || undefined,
//       });

//       // 🚀 Start QR Scanner
//       scanner.current
//         .start()
//         .then(() => setQrOn(true))
//         .catch((err) => {
//           if (err) setQrOn(false);
//         });
//     }

//     // 🧹 Clean up on unmount.
//     // 🚨 This removes the QR Scanner from rendering and using camera when it is closed or removed from the UI.
//     return () => {
//       if (scanner.current) {
//         scanner.current.stop();
//         scanner.current = null;
//       }
//     };
//   }, []);

//   // ❌ If "camera" is not allowed in browser permissions, show an alert.
//   useEffect(() => {
//     if (!qrOn) {
//       alert(
//         "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
//       );
//     }
//   }, [qrOn]);

//   return (
//     <div className="qr-reader">
//       {/* QR */}
//       <video ref={videoEl} className="qr-video"></video>
//       <div ref={qrBoxEl} className="qr-box">
//         <img
//         //   src={QrFrame}
//           alt="Qr Frame"
//           width={256}
//           height={256}
//           className="qr-frame"
//         />
//       </div>

//       {/* Show Data Result if scan is success */}
//       {scannedResult && (
//         <p
//           style={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             zIndex: 99999,
//             color: "white",
//           }}
//         >
//           Scanned Result: {scannedResult}
//         </p>
//       )}
//     </div>
//   );
// };

// export default ScanQRCode;

