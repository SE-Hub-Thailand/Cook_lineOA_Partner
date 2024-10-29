import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import ReceiptModal from "./ReceiptModal";
import { useParams } from "react-router-dom";
import TextModal from "../../components/TextModal";
import { getRedeemsByQrCode } from "../../api/strapi/redeemApi";
import { getShopById } from "../../api/strapi/shopApi";
// import { useNavigate } from 'react-router-dom';
// export default function GetRedeem({ qrCode}) {
export default function GetRedeem() {
//   const qrCode = "O4G7VhRjyD";
//   const navigate = useNavigate();
  const { qrCode } = useParams();
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');
//   const userId = localStorage.getItem('lineId');
//   const [shop, setShop] = useState(null);

  const [redeem, setRedeem] = useState(null);
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchRedeem = async () => {
      try {
        setLoading(true);

		// const shopData = await getShopById(token, userId);
		// if (shopData) {
		// 	setShop(shopData);
		// 	console.log("heloooo shopData: ", shopData);
		// }
        const redeemData = await getRedeemsByQrCode(qrCode);
		if (redeemData) {
			setRedeem(redeemData);
			console.log("helloo redeemData: ", redeemData);
		}
        // localStorage.setItem('redeem', JSON.stringify(pointsData));
        // getAllHistoryPoints(id, token);
        console.log("redeemData.productJsonArray: ", redeemData.productJsonArray)
        console.log("json parse Point: ", redeemData.productJsonArray.length);
		if (redeemData && redeemData.productJsonArray && redeemData.productJsonArray.length !== undefined) {
			const list = JSON.parse(redeemData.productJsonArray);
			const productArray = JSON.parse(list);
			setItems(productArray);
			if (productArray.length === 0) {
				setShowModal(true);
			}
		}
		// console.log("redeem.l: ", redeem.length);
		else {
			console.log("errrrr");
			setShowModal(true);
			// return (<TextModal title="No data" message="not found" path="/partner/qr-reader" />);
		}
		// console.log("productArray: ", productArray);
		// console.log("productArray.length: ", productArray[0]);

        setLoading(false); // หยุด loading
      } catch (error) {
        console.error("Error fetching history points:", error);
		setShowModal(true);
		// <TextModal title="No data" message="not found" path="/partner/qr-reader" />
        setError(error.message);
        setLoading(false);
		// return (<TextModal title="No data" message="not found" path="/partner/qr-reader" />);
      }
    };

    fetchRedeem();
  }, [qrCode]);

//   if (!redeem) {
// 	console.log("helllo1: ", showModal);

// 	setError("ไม่พบข้อมูลสินค้า");
// 	setShowModal(true);
// 	console.log("helllo2: ", showModal);
// 	// <TextModal title="No data" message="not found" path="/partner/qr-reader" />
// 	// return (<TextModal title="No data" path="/partner/qr-reader" />);
// }
  // ถ้ากำลังโหลดอยู่ ให้แสดง LoadingSpinner
  if (error) {
	  setShowModal(true);
	}
  if (loading) return <LoadingSpinner />;

  return (
    <>
	{console.log("showModal: ", showModal)}
      {showModal ? (<TextModal message="ไม่พบข้อมูลสินค้า" path="/partner/qr-reader" />) : (<ReceiptModal redeem={redeem} items={items} />)}
    </>
  )
};
