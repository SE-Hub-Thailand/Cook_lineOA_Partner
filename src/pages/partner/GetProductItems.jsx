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

import { convertDateTime2 } from '../../components/ConvertDateTime';
// import ReceiptModal from "./ReceiptModal";
import TextModal from "../../components/TextModal";
import SelectReceipt from "./SelectReceipt";
import { getAllProductsByShopId } from "../../api/strapi/productApi";
// import { useParams } from "react-router-dom";

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

export default function GetProductItems() {
//   const { id } = useParams();
  const shopId = 1;
  const token = import.meta.env.VITE_TOKEN_TEST ;
  const [products, setProducts] = useState([]);
  // const [redeemDataArray, setRedeemDataArray] = useState(null);
  const [searchDate, setSearchDate] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showErrorModal, setShowErrorModal] = useState(false);

  const theme = createTheme({
    typography: {
      fontFamily: "Sarabun !important",
    },
  });
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const ProductData = await getAllProductsByShopId(token, shopId);
        setProducts(ProductData);
        setLoading(false);

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

	const [searchTerm, setSearchTerm] = useState('');
	// Filter products based on the search term
	const filteredProducts = products.filter(product =>
		product.name.toLowerCase().includes(searchTerm.toLowerCase())
	);
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <FaSearch />
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>

          {filteredProducts.map((product, index) => (
            <div key={index} className="w-full bg-white mt-10 rounded-lg shadow-md p-5 relative">
              <div className="absolute top-4 right-2">
                <span
                  className={`px-2 py-1 rounded-md text-sm ${
                    product.approved === false
                      ? "text-red-600 border border-red-600"
                      : "text-green-600 border border-green-600"
                  }`}
                >
                  {product.approved === false ? "ยังไม่อนุมัติ" : "อนุมัติแล้ว"}
                </span>
              </div>

              <p>เลขที่ใบรายการเพิ่มสินค้า : {formatNumber(product.id)}</p>
              <p className="mt-2">{product.name}</p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm">{convertDateTime2(product.updatedAt)}</p>
                {/* <button
                  onClick={() => handleOpen(product, JSON.parse(product.productJsonArray))}
                  className="absolute right-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md px-2 py-1 text-sm"
                >
                  ดูใบเสร็จ
                </button> */}
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
