import Header from "../../components/partner/Header";
import { FaPlus, FaRegSave, FaEdit } from "react-icons/fa";
import Container from "@mui/material/Container";
// import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from '@mui/material/Box';
import { HiX } from "react-icons/hi";
// import TextField from '@mui/material/TextField';
import WebcamCapture from "../../components/WebcamCapture";
import WebcamCapture2 from "../../components/WebcamCapture2";
import LoadingSpinner from "../../components/LoadingSpinner";
import React, { useState, useEffect } from 'react';
import { Grid, TextField, Button, CircularProgress } from "@mui/material";
import Swal from "sweetalert2";
import { uploadImageFromBase64 } from "../../api/strapi/uploadApi";
import { useNavigate } from 'react-router-dom';
import { createProduct, updateProduct, getAllProductsByShopId } from "../../api/strapi/productApi";
import { getFormulaPointByPrice } from "../../api/strapi/formulaPointApi";
import CameraCapture from "../../components/CameraCapture";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 2,
  maxHeight: "80vh",      // กำหนดความสูงสูงสุด
  overflowY: "auto"       // เปิดใช้งานการเลื่อนในแนวตั้ง
};
// Mock data
// const products = [
//   { id: 1, name: "หอมหัวใหญ่", image: "onion", stock: 20, totalPrice: 100 },
//   { id: 2, name: "หอมหัวใหญ่", image: "vet", stock: 40, totalPrice: 120 },
//   { id: 3, name: "พริกหยวก", image: "pepper", stock: 50, totalPrice: 500 },
// ];

export default function AddProduct() {
  const shopId = localStorage.getItem('shopId');
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:1400';  // Fallback to default if env variable not set
  const token = import.meta.env.VITE_TOKEN_TEST;
  // const token = localStorage.getItem('token');
  console.log("token in AddProduct: ", token);
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  // const [uploadedImage, setUploadedImage] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hasImage, setHasImage] = useState(false);  // สถานะว่ามีภาพหรือไม่
  const [loading, setLoading] = useState(true);
  const [capturedImage, setCapturedImage] = useState(null);

  const [error, setError] = useState(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    // setUploadedImage(null);
  };

  const [formData, setFormData] = useState({
    productName: "",
    numStock: "",
    type: "",
    price: "",
    image: "",
  });

  const clearFormData = () => {
    setFormData({
      productName: "",
      numStock: "",
      type: "",
      price: "",
      image: "",
    });
  };

  useEffect(() => {
    const {
      productName,
      numStock,
      type,
      price,
      // description,
      // image,
    } = formData;

  setIsFormValid(
      !!productName &&
      !!numStock &&
      !!type &&
      !!price
      // !!description
      // !!image
    );
  }, [formData]);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const ProductData = await getAllProductsByShopId(shopId);
        setProducts(ProductData);
        setLoading(false);

      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [shopId, token]);

  const theme = createTheme({
    typography: {
      fontFamily: 'Sarabun !important',
    },
  });

    // Function to handle file change from FileUpload component
  // const handleFileChange = (file) => {
  //   console.log("file change: ", file);
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     photoImage: file, // Store the file in formData
  //   }));
  // };

  const handleImageCaptured = (id, imageData) => {
    if (imageData) {
      localStorage.setItem(id, imageData);
      console.log("id: ", id);
      console.log("imageData: ", imageData);
      setHasImage(true);
      setCapturedImage(imageData);
      console.log("imageData: ", imageData);
    } else {
        setHasImage(false);  // ไม่มีภาพ
      }
  };
// ]

  const handleInputChange = (e) => {
    const { id, name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id || name]: type === "checkbox" ? checked : value,
    }));
  };

  // const handleImageUpload = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       setUploadedImage(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("formData: ", formData);
    // อัปโหลดรูปภาพก่อน ถ้ามีรูปภาพที่จะอัปโหลด

    let imageId = 0;
    const base64Image = localStorage.getItem('productImage');
    if (base64Image) {
      console.log("base64Image: ", base64Image);
      const imageObject = await uploadImageFromBase64(base64Image)
      console.log("base imageObject: ", imageObject);
      if (imageObject) {
        imageId = imageObject.id;
        formData.image = imageObject.url;
      }
    }

    // const fileImage = localStorage.getItem('file');
    // if (fileImage) {
    //   console.log("fileImage: ", fileImage);
    //   const imageObject = await handlePhotoUpload(fileImage)
    //   console.log("file imageObject: ", imageObject);
    //   if (imageObject) {
    //     imageId = imageObject.id;
    //     formData.image = imageObject.url;
    //   }
    // }
    console.log("imageId: ", imageId);
    const formula = await getFormulaPointByPrice(1);
    console.log("formula[0]: ", formula[0]);
    console.log("formula[0].point: ", formula[0].point);
    const productData = {
      name: formData.productName,
      numStock: formData.numStock,
      type: formData.type,
      price: formData.price,
      image: imageId === 0 ? null : imageId,
      status: "pending",
      shop: shopId,
      point: formula[0].point ? formula[0].point * formData.price : 10, //default point
    };
  console.log("userData before: ", productData);
    const response = await createProduct(productData);
    if (response) {
      console.log("Products created successfully!");
      handleClose();
      clearFormData();
      Swal.fire({
        icon: "success",
        text: "ทำการเพิ่มสินค้าเรียบร้อยแล้ว รอการอนุมัติ",
        position: "center",
        showConfirmButton: true,
        confirmButtonText: "ตกลง",
      });
      return;
      // setShowModal(true);
    } else {
      throw new Error('Products create failed.');
    }
  };

  if (loading) return <LoadingSpinner />; // Loading state
  if (error) return <p>Error: {error}</p>; // Error state


  return (
    <>
      <ThemeProvider theme={theme}>
        <Header />
        <Container maxWidth="sm">
          <div className="flex flex-row">
            <div className="basis-6/12"></div>
            <div
              onClick={handleOpen}
              className="basis-6/12 bg-green-hard-bg w-36 h-12 flex justify-center items-center rounded-md mt-5 ml-10 cursor-pointer"
            >
              <FaPlus className="text-2xl text-white" />
              <span className="text-white pl-3">เพิ่มสินค้า</span>
            </div>
          </div>

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <form onSubmit={handleSubmit}>
            <Box sx={style}>
            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/2 px-2 mt-4">
                <TextField
                  id="productName"
                  label="ชื่อสินค้า"
                  variant="outlined"
                  className="w-full bg-white"
                  required
                  value={formData.productName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="w-full md:w-1/2 px-2 mt-4">
                <TextField
                  id="numStock"
                  label="จำนวนสินค้า"
                  variant="outlined"
                  className="w-full bg-white"
                  required
                  value={formData.numStock}
                  onChange={handleInputChange}
                />
              </div>
              <div className="w-full md:w-1/2 px-2 mt-4">
                <TextField
                  id="type"
                  label="ประเภทสินค้า"
                  variant="outlined"
                  className="w-full bg-white"
                  required
                  value={formData.type}
                  onChange={handleInputChange}
                />
              </div>
              <div className="w-full md:w-1/2 px-2 mt-4">
                <TextField
                  id="price"
                  label="ราคาสินค้าต่อชิ้น"
                  variant="outlined"
                  className="w-full bg-white"
                  required
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </div>
              <div className="w-full px-2 mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    ถ่ายรูปหรืออัพโหลดภาพสินค้า<span className="text-red-500">*</span>
                  </label>
                  {/* <WebcamCapture2 onCapture={handleImageCapture} id="productImage" /> */}
                  <CameraCapture
                    onImageCaptured={handleImageCaptured}
                    initialImage=""// ใส่ URL ของภาพหรือ Data URL ที่ต้องการ
                    id="productImage"
                  />
            </div>
            <div className="grid grid-cols-2 w-full md:w-1/2 px-2 mt-8 justify-items-stretch">
              <button
                className="bg-gray-300 pr-4 pl-4 h-10 rounded col-span-1 justify-self-start"
                onClick={handleClose}
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={!isFormValid || !hasImage || showModal}
                className={`h-10 rounded pr-4 pl-4 flex justify-center items-center col-span-1 justify-self-end ${
                  isFormValid && hasImage
                    ? "bg-green-hard-bg hover:bg-green-600 active:bg-green-700 pl-2 pr-2"
                    : "bg-gray-300 cursor-not-allowed"
                } ${isFormValid && hasImage ? "cursor-pointer" : ""}`}
              >
                <FaRegSave className="text-white text-2xl" />
                <span className="pl-2 text-white">เพิ่มสินค้า</span>
              </button>
            </div>

            </div>
            </Box>
            </form>
          </Modal>

          {/* Render Products */}
          {products
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((product) => (
              <div key={product.id} className="w-full h-auto bg-white rounded-md inner-shadow p-5 mt-10 mb-10 relative">
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-md text-sm ${
                      product.status === "pending" ? "bg-yellow-200 border border-yellow-200 text-yellow-800" :
                      product.status === "approved" ? "bg-green-200 border border-green-200 text-green-800" :
                      product.status === "rejected" ? "bg-red-200 border border-red-200 text-red-800" : ""
                    }`}
                  >
                    {product.status === "pending" ? "รอการอนุมัติ" :
                    product.status === "approved" ? "อนุมัติแล้ว" :
                    product.status === "rejected" ? "ไม่อนุมัติ" : ""}
                  </span>
                </div>

                {/* Product Information */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <img
                      src={
                        product.image?.data?.attributes?.url
                          ? `${API_URL}${product.image.data.attributes.url}`
                          : "https://cdn.britannica.com/70/234870-050-D4D024BB/Orange-colored-cat-yawns-displaying-teeth.jpg"
                      }
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  </div>
                  <p className="col-span-2 text-2xl mt-8">{product.name}</p>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-8">
                  <p className="col-span-2">จำนวนสินค้าในสต็อก</p>
                  <p className="text-center">{product.numStock}</p>
                  <p className="text-right">ชิ้น</p>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-4">
                  <p className="col-span-2">ราคาต่อชิ้น</p>
                  <p className="text-center">{product.price}</p>
                  <p className="text-right">บาท</p>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-4">
                  <p className="col-span-2">จำนวนเงินทั้งหมด</p>
                  <p className="text-center">{product.price * product.numStock}</p>
                  <p className="text-right">บาท</p>
                </div>
              </div>
            ))}

        </Container>
      </ThemeProvider>
    </>
  );
}
