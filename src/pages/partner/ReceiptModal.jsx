import React, { useState } from "react";
import PropTypes from "prop-types";
import ReactSlider from "react-slider";
import { HiX } from "react-icons/hi";
import { createInvoice } from "../../api/strapi/invoiceApi";
import { updateRedeem } from "../../api/strapi/redeemApi";
import { updateProduct } from "../../api/strapi/productApi";
import { useNavigate } from "react-router-dom";
import Alert from "../../components/Alert.jsx";

export default function ReceiptModal({ id, product, item }) {
  if (!product || !item) return null;

  const shopId = localStorage.getItem("shopId");

  ReceiptModal.propTypes = {
    id: PropTypes.number.isRequired,
    product: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        numStock: PropTypes.number.isRequired,
      })
    ).isRequired,
    item: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        counts: PropTypes.number.isRequired,
        point: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
      })
    ).isRequired,
  };

  const [showModal, setShowModal] = useState(true);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [slidePercent, setSlidePercent] = useState(0);
  const navigate = useNavigate();
  const [products, setProducts] = useState(product);
  const [items] = useState(item);

  const handleClose = () => {
    setShowModal(false);
    navigate("/partner/qr-reader");
  };

  const totalPoint = items.reduce((sum, item) => sum + item.counts * item.point, 0);

  const formatNumber = (num) => num.toString().padStart(5, "0");

  const handleSliderChange = async (value) => {
    setSlidePercent(value);
    setIsCompleted(value === 100);
    if (value === 100) {
      let updatedStocks = [];
      let totalPrice = 0;
      // Update product stock and collect changed values
      products.forEach((product) => {
        items.forEach((item) => {
          if (product.id === item.id) {
            product.numStock -= item.counts;
            totalPrice += item.counts * item.price;
            if (product.numStock < 0) {
              setShowModal3(true);
              return;
            }
            updatedStocks.push({ id: product.id, numStock: product.numStock });
          }
        });
      });

      console.log('updatedStocks', updatedStocks);
      // Updated code to use updateProduct
      updatedStocks.map(async (updatedProduct) => {
        // Find the original product data from products array
        const originalProduct = products.find(
          (product) => product.id === updatedProduct.id
        );
        if (originalProduct) {
          // Prepare the product data for the update
          const productData = {
            numStock: updatedProduct.numStock,
          };

          try {
            // Call the updateProduct function
            const response = await updateProduct(updatedProduct.id, productData);
            console.log("Product updated successfully:", response);
          } catch (error) {
            console.error("Error updating product:", error);
            return;
          }
        }
      });
        console.log("All products updated successfully!");

        // Update redeem status
        const responseRedeem = await updateRedeem(id, { status: "approved" });
        if (responseRedeem) {
          console.log("Redeem updated successfully!");

          // Create invoice
          const invoiceData = {
            amount: totalPrice,
            status: "pending",
            invoiceNumber: formatNumber(id),
            redeem: id,
            shop: shopId,
          };
          const responseInvoice = await createInvoice(invoiceData);
          if (responseInvoice) {
            console.log("Invoice created successfully!");
            setShowModal2(true);
            // navigate("/partner/get-money-item");
          }
    }
  }
};
  // };

  return (
    <>
     {showModal3 ? (
      <Alert
        title="ไม่สามารถหักสต็อกสินค้า"
        message="จำนวนสินค้าคงเหลือไม่เพียงพอ"
        path="/partner/qr-reader"
        status="fail"
      />
    ) : showModal2 ? (
      <Alert
        title="รายการแลกแต้มสำเร็จ"
        message="ระบบได้ทำการหักสต็อกสินค้าเรียบร้อยแล้ว"
        path="/partner/get-money-item"
        status="success"
      />
    ) : showModal ? (
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
                <span className="text-lg">{totalPoint} บาท</span>
              </div>

              {/* Slide to Confirm Section */}
              <div className="rounded-md p-6 mt-24 bg-gray-200">
                <p className="text-center mt-4 font-semibold">สไลด์เพื่อยืนยันการส่งสินค้า</p>
                <div className="flex w-72 items-center justify-center mt-6">
                  <div className="relative w-full h-12 rounded-md">
                    <ReactSlider
                      className="absolute inset-0 h-full w-full flex items-center justify-center"
                      value={slidePercent}
                      onChange={handleSliderChange}
                      min={0}
                      max={100}
                      renderTrack={(props) => (
                        <div {...props} className="h-full" style={{ background: "#f5f5f5" }} />
                      )}
                      renderThumb={(props) => (
                        <div
                          {...props}
                          className="absolute top-0 flex items-center justify-center w-12 h-full bg-yellow-500 text-white rounded-md cursor-pointer shadow-lg"
                          style={{
                            left: `${Math.min(slidePercent, 100)}%`,
                            transform: "translateX(-50%)",
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
                      )}
                    />
                  </div>
                </div>
                {!isCompleted && slidePercent < 100 ? (
                  <p className="text-center text-red-500 mt-4">กรุณาสไลด์ให้สุดเพื่อยืนยันการส่งสินค้า</p>
                ) : (
                  <p className="text-center text-green-500 mt-4">ยืนยันการส่งสินค้าแล้ว</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ):
      <Alert
        title="เกิดข้อผิดพลาด"
        message=""
        path="/partner/qr-reader"
        status="fail"
      />
      }
    </>
  );
}
