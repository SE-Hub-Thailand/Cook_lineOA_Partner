import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // นำ useNavigate เข้ามาใช้

export default function TextModal({ message, path }) {
  const [showModal, setShowModal] = useState(true); // Modal is initially visible
  const navigate = useNavigate(); // เรียกใช้ useNavigate
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
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={closeModal}
            >
              &times;
            </button>

            {/* Image */}
            <div className="flex justify-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1828/1828843.png" // Replace with a suitable image URL
                alt="Insufficient Text"
                className="w-32 h-32"
              />
            </div>

            {/* Text */}
            <p className="text-center text-lg font-semibold text-red-600 mt-4">
              {message}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
