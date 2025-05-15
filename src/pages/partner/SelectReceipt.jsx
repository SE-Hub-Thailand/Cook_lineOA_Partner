import React, { useState } from "react";
import { HiX } from "react-icons/hi";
import { createInvoice } from "../../api/strapi/invoiceApi";
import { updateRedeem } from "../../api/strapi/redeemApi";
import { useNavigate } from "react-router-dom";

export default function ReceiptModal({ redeem, items, onClose }) {
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate(); // use navigate to go back on close

  if (!redeem || !items) {
    return null;
  }

  const closeModal = () => {
    setShowModal(false);
    navigate('/partner/get-money-item'); // Go back to the previous page
  };

  const totalPoint = items.reduce((sum, item) => sum + item.counts * item.point, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.counts * item.price, 0);

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md h-auto p-6">
            {/* Close Button */}
            <div className="w-full flex items-center justify-end mb-4">
              <HiX className="text-2xl text-gray-600 cursor-pointer" onClick={onClose}/>
            </div>

            {/* Table */}
            <div className="w-full">
              <table className="min-w-full border-collapse border border-black">
                <thead>
                <tr>
                    <th className="px-4 py-2 border border-black">รายการสินค้า</th>
                    <th className="px-4 py-2 border border-black">จำนวน</th>
                    <th className="px-4 py-2 border border-black">มูลค่า (บาท)</th>
                    <th className="px-4 py-2 border border-black">แลก (แต้ม)</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    item.counts > 0 && (
                      <tr key={index} className="text-center">
                        <td className="px-4 py-2 border-r border-black">{item.name}</td>
                        <td className="px-4 py-2 border-r border-black">{item.counts}</td>
                        <td className="px-4 py-2 border-r border-black">{item.price * item.counts}</td>
                        <td className="px-4 py-2">{item.point * item.counts}</td>
                      </tr>
                    )
                  ))}
                </tbody>
              </table>
              <div className="mt-4 flex justify-between items-center font-bold">
                <span className="text-lg">รวมเป็น</span>
                <span className="text-lg">{totalPoint} แต้ม</span>
              </div>

              <div className="mt-4 flex justify-between items-center font-bold">
                <span className="text-lg">รวมเป็นมูลค่า</span>
                <span className="text-lg">{totalPrice} บาท</span>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
