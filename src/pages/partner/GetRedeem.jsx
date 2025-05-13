import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import ReceiptModal from "./ReceiptModal";
import { useParams, useNavigate } from "react-router-dom";
import { getRedeemsByQrCode } from "../../api/strapi/redeemApi";
import { getAllProductsByShopId } from "../../api/strapi/productApi";
import Alert from "../../components/Alert";

export default function GetRedeem() {
  const { qrCode } = useParams();
  const navigate = useNavigate();
  const shopId = localStorage.getItem("shopId");
  // const token = localStorage.getItem("token");

  const [redeem, setRedeem] = useState(null);
  const [redeemId, setRedeemId] = useState(null);
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    const fetchRedeem = async () => {
      try {
        setLoading(true);
        const redeemData = await getRedeemsByQrCode(qrCode);
  
        if (!redeemData || redeemData.length === 0) {
          throw new Error("ไม่พบข้อมูลการแลกแต้ม");
        }
  
        const r = redeemData[0];
  
        // ✅ ตรวจสอบร้านค้า
        if (!r.shop?.id || r.shop.id.toString() !== shopId?.toString()) {
          throw new Error("QR นี้ไม่ตรงกับร้านของคุณ");
        }
  
        setRedeem(r);
        setRedeemId(r.id);
  
        try {
          const parsed = JSON.parse(r.productJsonArray || "[]");
          const productArray = JSON.parse(parsed);
          setItems(productArray);
          if (productArray.length === 0) {
            setShowModal(true);
          }
        } catch {
          throw new Error("ไม่สามารถแปลงข้อมูลสินค้าได้");
        }
      } catch (err) {
        console.error("❌ Redeem fetch error:", err);
        setError(err.message || "เกิดข้อผิดพลาด");
      } finally {
        setLoading(false);
      }
    };
  
    fetchRedeem();
  }, [qrCode]);  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productData = await getAllProductsByShopId(shopId);
        setProducts(productData || []);
      } catch (err) {
        console.error("❌ Product fetch error:", err);
        setError("ไม่สามารถโหลดรายการสินค้า");
      }
    };

    fetchProducts();
  }, [shopId]);

  if (loading) return <LoadingSpinner />;

  if (error || !redeem) {
    return (
      <Alert
        title="เกิดข้อผิดพลาด"
        message={error || "ไม่สามารถโหลดข้อมูลการแลกแต้ม"}
        path="/partner/qr-reader"
        status="fail"
      />
    );
  }

  if (redeem.status === "approved") {
    return (
      <Alert
        title="รายการนี้ถูกใช้แล้ว"
        message="ไม่สามารถแลกซ้ำได้"
        path="/partner/qr-reader"
        status="fail"
      />
    );
  }

  if (showModal) {
    return (
      <Alert
        title="ไม่พบรายการสินค้า"
        message="อาจเกิดจากการแลกแต้มที่ไม่สมบูรณ์"
        path="/partner/qr-reader"
        status="fail"
      />
    );
  }

  return (
    <div className="px-4 mt-10 text-center">
      <h2 className="text-xl font-bold text-gray-800">ยืนยันการแลกรายการ</h2>
      <div className="mt-6">
        <ReceiptModal id={redeemId} product={products} redeem={redeem} item={items} />
      </div>
      <div className="mt-8">
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-md"
          onClick={() => navigate("/partner/qr-reader")}
        >
          กลับหน้าสแกน QR
        </button>
      </div>
    </div>
  );
}
