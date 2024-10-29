import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom'; // นำ useNavigate เข้ามาใช้

const Alert = ({ title, message, path }) => {
//   const [isVisible, setIsVisible] = useState(true); // กำหนดสถานะแสดงผลเริ่มต้นเป็น true
  const navigate = useNavigate(); // เรียกใช้ useNavigate

  const [showModal, setShowModal] = useState(true); // Modal is initially visible

  useEffect(() => {
    if (showModal) {
      // เลื่อนหน้าจอขึ้นไปบนสุดเมื่อแสดงผล Alert
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [showModal]);
  const closeModal = () => {
    setShowModal(false); // Close modal on button click
	if (path)
		navigate(path);
	else
		navigate(0);
  };

  return (
    <>
      {showModal && (
        <div className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
		<div className="flex justify-between">
		  <div className="flex">
			<div className="py-1">
			  <svg
				className="fill-current h-6 w-6 text-teal-500 mr-4"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
			  >
				<path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
			  </svg>
			</div>
			<div>
			  <p className="font-bold">{title}</p>
			  <p className="text-sm">{message}</p>
			</div>
		  </div>
		  <div>
			{/* ปุ่มกากบาทสำหรับปิด Alert */}
			<button onClick={closeModal} className="text-teal-500">
			  <svg className="fill-current h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
				<path d="M10 8.586l4.95-4.95 1.414 1.414L11.414 10l4.95 4.95-1.414 1.414L10 11.414l-4.95 4.95-1.414-1.414L8.586 10 3.636 5.05l1.414-1.414L10 8.586z" />
			  </svg>
			</button>
		  </div>
		</div>
	  </div>
      )}
    </>
  );
};

Alert.propTypes = {
title: PropTypes.string.isRequired, // กำหนดให้ title ต้องเป็น string และต้องมีค่าเสมอ
message: PropTypes.string.isRequired, // กำหนดให้ message ต้องเป็น string และต้องมีค่าเสมอ
path: PropTypes.string, // path สามารถมีหรือไม่มีก็ได้ ดังนั้นไม่ต้องใส่ .isRequired
};

Alert.defaultProps = {
path: '', // กำหนดค่า default ให้ path เป็น string ว่าง (ในกรณีที่ไม่ต้องการนำทาง)
};

export default Alert;
