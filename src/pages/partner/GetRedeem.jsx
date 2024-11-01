import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import ReceiptModal from "./ReceiptModal";
import { useParams } from "react-router-dom";
import TextModal from "../../components/TextModal";
import { getRedeemsByQrCode } from "../../api/strapi/redeemApi";
import { getShopById } from "../../api/strapi/shopApi";
import { getAllProductsByShopId } from "../../api/strapi/productApi";
import Alert from "../../components/Alert";
// import { useNavigate } from 'react-router-dom';
// export default function GetRedeem({ qrCode}) {
export default function GetRedeem() {
//   const qrCode = "O4G7VhRjyD";
//   const navigate = useNavigate();
  const shopId = localStorage.getItem('shopId');
  const { qrCode } = useParams();
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');
  const [products, setProducts] = useState([]);
//   const userId = localStorage.getItem('lineId');
//   const [shop, setShop] = useState(null);

  const [redeem, setRedeem] = useState(null);
  const [redeemId, setRedeemId] = useState(null);
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchRedeem = async () => {
      try {
        setLoading(true);
        const redeemData = await getRedeemsByQrCode(qrCode);
        if (redeemData) {
          setRedeem(redeemData[0]);
          console.log("helloo redeemData: ", redeemData[0].status);
          setRedeemId(redeemData[0].id);
        }
            // localStorage.setItem('redeem', JSON.stringify(pointsData));
            // getAllHistoryPoints(id, token);
            console.log("redeemData.productJsonArray: ", redeemData[0].productJsonArray)
            // console.log("json parse Point: ", redeemData.productJsonArray.length);
        if (redeemData && redeemData[0].productJsonArray) {
          const list = JSON.parse(redeemData[0].productJsonArray);
          console.log("list: ", list);
          const productArray = JSON.parse(list);
          setItems(productArray);
          console.log("productArray: ", productArray);
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const ProductData = await getAllProductsByShopId(shopId);
        setProducts(ProductData);
        setLoading(false);
        console.log("ProductData: ", ProductData);
        if (ProductData.length === 0) {
          alert("No product for this shop");
        //   navigate("/home");
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [shopId, token]);

  // let updatedStocks = [];

  // // Update product stock and collect changed values
  // products.forEach(product => {
  //   items.forEach(item => {
  //     if (product.id === item.id) {
  //       product.numStock -= item.counts; // Deduct stock count
  //       updatedStocks.push({ id: product.id, numStock: product.numStock }); // Collect updated stock
  //     }
  //   });
  // });

  // console.log("updatedStocks ", updatedStocks);

  if (error) {
	  setShowModal(true);
	}
  if (loading) return <LoadingSpinner />;

  return (
    <>
    {redeem.status === "approved" ?
      (<Alert
          title="การแลกสินค้าของรายการนี้ได้เสร็จสิ้นแล้วและไม่สามารถทำการแลกซ้ำได้"
          message=""
          path="/partner/qr-reader"
          status="fail"
        /> )
    : showModal ?
        (<Alert
          title="ไม่พบข้อมูลสินค้า!"
          message=""
          path="/partner/qr-reader"
          status="fail"
        /> )
        : (<ReceiptModal id={redeemId} product={products} redeem={redeem} item={items} />)
      }
    </>

  )
};
