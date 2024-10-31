import React, { useState } from "react";
import ReactSlider from "react-slider";
import { HiX } from "react-icons/hi";
import { createInvoice } from "../../api/strapi/invoiceApi";
import { updateRedeem } from "../../api/strapi/redeemApi";
import { useNavigate } from "react-router-dom";

export default function ReceiptModal({id, redeem, items}) {
  if (!redeem || !items) {
    return null;
  }
  const [showModal, setShowModal] = useState(true); // Modal is initially visible
  const [isCompleted, setIsCompleted] = useState(false);
  const [slidePercent, setSlidePercent] = useState(0);
  const navigate = useNavigate();

  const handleClose = () => {
    setShowModal(false); // Close modal on button click
    navigate('/partner/qr-reader');
  };

  // const items = [
  //   { name: "หัวไชเท้า", counts: 1, point: 10 },
  //   { name: "หอมหัวใหญ่", counts: 2, point: 10 },
  // ];

  const totalpoint = items.reduce((sum, item) => sum + item.counts * item.point, 0);

  const handleSliderChange = async (value) => {
    setSlidePercent(value);
    setIsCompleted(value === 100);
    if (value === 100) {
      console.log("updateRedeem... id : ", id);
      const response_redeem = await updateRedeem(id, { status: "approved" });
      if (response_redeem) {
        // console.log("response_redeem.jwt : ", response_redeem.jwt );
        // const response = await updateProduct( productId, productData)
        console.log("updateRedeem successfully!");
        navigate('/partner/get-money-item');
        // setShowModal(true);
      }
    }
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg h-screen">
            {/* Close Button */}
            <div className="w-full h-12 bg-red-600 flex items-center justify-end px-3 mb-4">
              <HiX className="text-xl text-white cursor-pointer" onClick={handleClose} />
            </div>

            {/* Table */}
            <div className="w-full p-6">
              <table className="min-w-full border-collapse border border-black">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border border-black">รายการสินค้า</th>
                    <th className="px-4 py-2 border border-black">จำนวน</th>
                    <th className="px-4 py-2 border border-black">มูลค่า (บาท)</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="text-center">
                      <td className="px-4 py-2 border-r border-black">{item.name}</td>
                      <td className="px-4 py-2 border-r border-black">{item.counts}</td>
                      <td className="px-4 py-2">{item.point}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 flex justify-between items-center font-bold">
                <span className="text-lg">รวมเป็นมูลค่า</span>
                <span className="text-lg">{totalpoint}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;บาท</span>
              </div>

              {/* Slide to Confirm Section */}
              <div className="rounded-md p-6 mt-24 bg-gray-200" >
              <p className="text-center mt-4 font-semibold">สไลด์เพื่อยืนยันการส่งสินค้า</p>
              <div className="flex w-72 items-center justify-center mt-6">

                <div className="relative w-full h-12 rounded-md">
                  <ReactSlider
                    className="absolute inset-0 h-full w-full flex items-center justify-center"
                    value={slidePercent}
                    onChange={handleSliderChange}
                    min={0}
                    max={100}

                    renderTrack={(props, state) => {
                      const { key, ...restProps } = props;
                      return (
                        <div
                        {...restProps}
                        key={key}
                        className="h-full "
                        style={{
                          width: "100%",
                          background: '#f5f5f5 25%, #FDE9EC 75%',
                          // background: `linear-gradient(to right, #FDE9EC ${state.valueNow}%, #f5f5f5 ${state.valueNow}%)`,
                        }}
                        />
                      );
                    }}
                    renderThumb={(props) => {
                      const { key, ...restProps } = props;
                      return (
                        <div
                        {...restProps}
                        key={key}
                        className="absolute top-0 flex items-center justify-center w-12 h-full bg-yellow-500 text-white rounded-md cursor-pointer shadow-lg"
                        style={{
                          left: `${Math.min(slidePercent, 100)}%`, // กำหนดขอบเขต thumb
                          transform: "translateX(-50%)",
                          zIndex: 10,
                        }}
                        >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              className="w-6 h-6"
                              >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                      );
                    }}
                    />


                </div>
              </div>
              {/* Error Message */}
              {!isCompleted && slidePercent < 100 ? (
                <p className="text-center text-red-500 mt-4">กรุณาสไลด์ให้สุดเพื่อยืนยันการส่งสินค้า</p>
              ) : (
                <p className="text-center text-green-500 mt-4">ยืนยันการส่งสินค้าแล้ว</p>
              )

              }
            </div>
          </div>
        </div>
      </div>
      )}
    </>
  );
}
