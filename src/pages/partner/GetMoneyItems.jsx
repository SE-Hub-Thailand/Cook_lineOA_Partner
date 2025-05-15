import Header from "../../components/partner/Header";
import Container from "@mui/material/Container";
import { FaSearch } from "react-icons/fa";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import React, { useState, useEffect } from "react";
import { HiX } from "react-icons/hi";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getRedeemsByShop } from "../../api/strapi/redeemApi";
import { convertDateTime } from '../../components/ConvertDateTime';
// import ReceiptModal from "./ReceiptModal";
import TextModal from "../../components/TextModal";
import SelectReceipt from "./SelectReceipt";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function GetMoneyItems() {
  const shopName = "Capybara Shop";
  const shopId = localStorage.getItem('shopId');
  // const [open, setOpen] = useState(false);
  const [redeem, setRedeem] = useState([]);
  // const [redeemDataArray, setRedeemDataArray] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleOpen = (redeem, items) => {
    try {
      if (!items) {
        setShowErrorModal(true);
      }
      const parsedItems = JSON.parse(items);
      setItems(parsedItems);
      setSelectedReceipt(redeem);
      if (!parsedItems || !redeem) {
        setShowErrorModal(true);
      } else {
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error parsing productJsonArray:", error);
      setItems([]); // Set to an empty array if parsing fails
    }
  };
  const handleClose = () => {
    setShowModal(false);
    setShowErrorModal(false);
  }

  const theme = createTheme({
    typography: {
      fontFamily: "Sarabun !important",
    },
  });
  useEffect(() => {
    const fetchRedeem = async () => {
      try {
        setLoading(true);
        const redeemData = await getRedeemsByShop(shopId);
        const r = JSON.stringify(redeemData);
        const rr = JSON.parse(r);
        setRedeem(redeemData || []);
        console.log("type of redeemData: ", redeemData);
        console.log("type of r: ", r);
        console.log("type of rr: ", rr);

        // console.log("helloo filteredRedeem: ", filteredRedeem);

        setLoading(false); // หยุด loading
      } catch (error) {
        console.error("Error fetching history points:", error);
		// setShowModal(true);
		// <TextModal title="No data" message="not found" path="/partner/qr-reader" />
        setError(error.message);
        setLoading(false);
		// return (<TextModal title="No data" message="not found" path="/partner/qr-reader" />);
      }
    };

    fetchRedeem();
  }, [shopName]);

  // ฟิลเตอร์ข้อมูล redeem ตามวันที่ที่ค้นหา
  const filteredRedeem = redeem.filter((item) => {
    if (!searchDate) return true;
     // แยกวันที่ออกจาก item.date
    const day = item.date ? item.date.split("-")[2] : ""; // ได้ค่า DD จาก "YYYY-MM-DD"

    // ตรวจสอบว่าค่าวันตรงกับ searchDate หรือไม่
    return day === searchDate;
  });
  // const filteredRedeem = redeem.filter((item) => {
  //   item.date.includes(searchDate)
  // });
  const formatNumber = (num) => num.toString().padStart(5, "0");

  return (
    <>
      <ThemeProvider theme={theme}>
        <Header />
        <Container maxWidth="sm">
          {/* ฟิลด์สำหรับการค้นหาวันที่ */}
          <FormControl fullWidth className="bg-white mb-4">
            <TextField
              label="ค้นหาตามวันที่"
              variant="outlined"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <FaSearch />
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>

          {filteredRedeem.map((redeem, index) => (
            <div key={index} className="w-full bg-white mt-10 rounded-lg shadow-md p-5 relative">
              <div className="absolute top-4 right-2">
                <span
                  className={`px-2 py-1 rounded-md text-sm
                    ${
                    redeem.paid === false
                      ? "text-red-600 border border-red-600"
                      : "text-green-600 border border-green-600"
                  }`
                }
                >
                  {redeem.paid === false ? "ค้างชำระ" : "ชำระแล้ว"}
                </span>
              </div>

              <p>เลขที่ใบรายการรับเงิน : {formatNumber(redeem.id)}</p>
              <p className="mt-2">{redeem.customer?.fullName}</p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm">{convertDateTime(redeem.date, redeem.time)}</p>
                <button
                  onClick={() => handleOpen(redeem, JSON.parse(redeem.productJsonArray))}
                  className="absolute right-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md px-2 py-1 text-sm"
                >
                  ดูใบเสร็จ
                </button>
                {showModal && redeem && redeem.productJsonArray && (
                  <SelectReceipt
                    redeem={selectedReceipt}
                    items={items}
                    onClose={handleClose}
                  />
                )}
                {showErrorModal && (
                  <TextModal
                    message="ไม่มีหลักฐานการชำระ"
                    path="/partner/get-money-item"
                  />
                )}


              </div>
            </div>
          ))}

        </Container>
      </ThemeProvider>
    </>
  );
}
