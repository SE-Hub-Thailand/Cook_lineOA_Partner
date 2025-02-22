import Header from "../../components/partner/Header";
import React, { useState, useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
// import Header from "../components/Header.jsx";
import FileUpload from "../../components/FileUpload.jsx";
import { Checkbox, TextField, InputLabel, MenuItem, Select } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import WebcamCapture from "../../components/WebcamCapture.jsx";
import { getUser, updateUser } from "../../api/strapi/userApi"; // Import createUser function
import { updateShop, getShopByUserId, getShopById } from "../../api/strapi/shopApi"; // Import createShop function
import Alert from "../../components/Alert.jsx";
import { getAllBank } from "../../api/strapi/bankApi"; // Import getAllBank function
// import { uploadImage } from "../api/strapi/uploadApi"; // Import uploadImage function
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { handlePhotoUpload, uploadImageFromBase64 } from "../../api/strapi/uploadApi";
import WebcamCapture2 from "../../components/WebcamCapture2";
import CameraCapture from "../../components/CameraCapture";

function UpdateShopProfile() {

  const userId = localStorage.getItem('lineId');

  const shopId = localStorage.getItem('shopId');

  console.log("shopId in Register.id: ", shopId);
  console.log("userId in Register: ", userId);
  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate(); // Initialize useNavigate for redirection
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [banks, setBanks] = useState([]);
  const [user, setUser] = useState([]);
  const [shop, setShop] = useState([]);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [hasImageCard, setHasImageCard] = useState(true);  // สถานะว่ามีภาพหรือไม่
  const [hasImageBank, setHasImageBank] = useState(true); 
  const [dataCardImage, setDataCardImage] = useState(null); 
  const [dataBankImage, setDataBankImage] = useState(null); 


  const [fileChange, setFileChange] = useState(false);

  const theme = createTheme({
    typography: {
      fontFamily: "Sarabun",
    },
  });

	useEffect(() => {
		const fetchUser = async () => {
		try {
			setLoading(true);
			const userData = await getUser(userId, token);
			// const userData = JSON.parse(localStorage.getItem('user'));
			setUser(userData);
      const shopData = await getShopByUserId(userData.id, token);
			setShop(shopData);
			setFormData({
        username: userData.username || "",
				fullName: userData.fullName || "",
				telNumber: userData.telNumber || "",
				gender: userData.gender || "",
				address: userData.address || "",
				cardID: userData.cardID || "",
				photoImage: userData.photoImage || "", // Assuming the image is not fetched here
				cardIdImage: userData.cardIdImage || "",
        storeName: shopData.name || "",
				bookBankNumber: shopData.bookBankNumber || "",
				bankName: shopData.bankName || "",
				bookBankImage: shopData.bookBankImage || "",
			});

			setLoading(false);
		} catch (error) {
      console.error("Error fetching users:", error);
			setError(error.message);
			setLoading(false);
		}
  };
  fetchUser();
}, [userId, token]);

// console.log("user: ", user);
// console.log("shop: ", shop);

  const [formData, setFormData] = useState({
    username: user?.username || "",
		fullName: user?.fullName || "",
    telNumber: user?.telNumber || "",
    gender: user?.gender || "",
    address: user?.address || "",
    cardID: user?.cardID || "",
    photoImage: user?.photoImage || "", // Assuming the image is not fetched here
    cardIdImage: user?.cardIdImage || "",
    storeName: shop?.name || "",
    image: shop?.image || "",
    bookBankNumber: shop?.bookBankNumber || "",
    bankName: shop?.bankName || "",
    bookBankImage: shop?.bookBankImage || "",
    checkedOne: false,
});
// console.log("formDataaa: ", formData);
// console.log("user?.photoImage: ", user?.photoImage, " user?.photoImage.url: ", user?.photoImage.url);
// console.log("user?.cardIdImage: ", user?.cardIdImager, " user?.cardIdImage.url: ", user?.cardIdImage.url);
	// useEffect(() => {
	// 	const fetchShop = async () => {
	// 	try {
	// 		setLoading(true);
	// 		const userData = await getUser(userId, token);
	// 		console.log("user.id: ", user.id);
	// 		const shopData = await getShopByUserId(userData.id, token);
	// 		console.log("shopData: ", shopData);
	// 		setShop(shopData);
	// 		setFormData({
	// 			storeName: shopData.name || "",
	// 			bookBankNumber: shopData.bookBankNumber || "",
	// 			bankName: shopData.bankName || "",
	// 			bookBankImage: shopData.bookBankImage || "",
	// 		});
	// 		setLoading(false);
	// 	} catch (error) {
	// 		console.error("Error fetching shop:", error);
	// 		setError(error.message);
	// 		setLoading(false);
	// 	}
	// 	};
	// 	fetchShop();
	// }, [shopId, token]);

	useEffect(() => {
		const fetchBanks = async () => {
			try {
				setLoading(true);
				const bankData = await getAllBank();
				setBanks(bankData);
				setLoading(false);
			} catch (error) {
				// console.error("Error fetching users:", error);
				setError(error.message);
				setLoading(false);
			}
			};
		fetchBanks();
	}, []);

  useEffect(() => {
    const {
      username,
	  storeName,
      fullName,
      telNumber,
      gender,
      address,
      cardID,
	    bookBankNumber,
      // bookBankImage,
      bankName,
      // cardIdImage,
      checkedOne,
    } = formData;

    setIsFormValid(
      username &&
	    storeName &&
      fullName &&
      telNumber &&
      gender &&
      address &&
      cardID &&
		  bookBankNumber &&
      // bookBankImage &&
      bankName &&
      // cardIdImage &&
      checkedOne
    );
  }, [formData]);

  // Function to handle file change from FileUpload component
  const handleFileChange = (file) => {
    console.log("file change: ", file);
    setFileChange(true);
    setFormData((prevData) => ({
      ...prevData,
      photoImage: file, // Store the file in formData
    }));
  };

  // Handle select input changes separately
  const handleSelectChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      bankName: event.target.value, // Make sure this key matches the `value` prop
    }));
  };

  const handleImageCaptured = (id, imageData) => {
    if (imageData) {
      // localStorage.setItem(id, imageData);
      if (id === "cardIdImage") {
        setHasImageCard(true);
        setDataCardImage(imageData);
      } else if (id === "bookBankImage") {
        setHasImageBank(true);
        setDataBankImage(imageData);
      }
      console.log("id: ", id);
      console.log("imageData: ", imageData);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("formData: ", formData);
    // อัปโหลดรูปภาพก่อน ถ้ามีรูปภาพที่จะอัปโหลด
    let imageId, cardId_id, bookBank_id = 0;
    if (fileChange && formData.photoImage) {
      const { url, id } = await handlePhotoUpload(formData.photoImage);
      imageId = id;
      // ใช้ URL ของรูปภาพและ ID ที่ได้จากการอัปโหลดใน formData หรืออื่น ๆ
      formData.photoImage = url;
      console.log("Uploaded Image URL:", url);
      console.log("Uploaded Image ID:", id);
    }

    // const base64Image = localStorage.getItem('cardIdImage');

    // console.log("base64Image cardIdImage: ", base64Image);
    console.log("base64Image cardIdImage: ", dataCardImage);

    const cardIdImageObject = await uploadImageFromBase64(dataCardImage)
    if (cardIdImageObject) {
      cardId_id = cardIdImageObject.id;
      formData.cardIdImage = cardIdImageObject.url;
    }
	// const base64Image2 = localStorage.getItem('bookBankImage');
  // console.log("base64Image2 bookBankImage: ", base64Image2);
  console.log("base64Image2 bookBankImage: ", dataBankImage);

    const bookBankImageObject = await uploadImageFromBase64(dataBankImage)
    if (bookBankImageObject) {
	  bookBank_id = bookBankImageObject.id;
    formData.bookBankImage = bookBankImageObject.url;
  }
  
  setLoading(true); // Start loading
    const userData = {
      username: formData.username || "cook" + userId ,
      // email: "cook" + userId + "@cook.com", // Assuming email is the same as username in this example
      // password: "cookcook",
      // lineId: userId,
      // userType: "customer",
      photoImage: imageId === 0 ? null : imageId,
      cardIdImage: cardId_id === 0 ? null : cardId_id,
      fullName: formData.fullName,
      telNumber: formData.telNumber,
      gender: formData.gender,
      address: formData.address,
      cardID: formData.cardID,
      shop: shop.id,
      // shop: {
      //   name: formData.storeName
      // }
    };
    const shopData = {
        user: user.id,
        image: imageId ? imageId : null,
        bookBankImage: bookBank_id ? bookBank_id : null,
        name: formData.storeName,
        location: formData.address,
        bookBankNumber: formData.bookBankNumber,
        bankName: formData.bankName,

      };
    // console.log("userData: ", userData);
    // console.log("shopData: ", shopData);
    //   console.log("token: ",token, "shopId: ", shop?.id, "shopData: ", shopData);
	const response1 = await updateUser(user?.id, userData, token);
	const response2 = await updateShop(token, shop?.id, shopData);
	if (response1 && response2) {
		setShowModal(true);
    setLoading(false);
    } else {
      throw new Error('Update failed.');
    }
  };
  // console.log("user.photoImage.url: ", user.photoImage.url);
  // console.log("shop: ", shop);
  // console.log("shop.img: ", shop.image);
  // console.log("shop.img url: ", shop.image.attributes.url);

  if (loading) return <LoadingSpinner />; // Loading state
  if (error) return <p>Error: {error}</p>; // Error state

  return (
    <>
      { showModal &&
      <>
        <Alert
          title="User updateed successfully!"
          message={`Welcome, ${formData.username}! We’re so happy to have you on Cook Website.`}
          path="/partner/add-product"
          status="success"
        />

      </>
      }
    <ThemeProvider theme={theme}>
	  <Header />
      {/* <FileUpload
        photoImage={shop?.image?.url ? `${API_URL}${shop.image.url}` : ""} // Pass photoImage from the user data
        onFileChange={handleFileChange}
      /> */}
      {/* {console.log("shop?.image?.attributes: ", shop?.image?.attributes.url)}
      {console.log("shop?.bookBankImage?.attributes: ", shop?.bookBankImage?.attributes.url)} */}

      <FileUpload
	  	//  photoImage={user?.photoImage?.url}
	  	photoImage={ shop?.image?.attributes?.url ? `${API_URL}${shop.image.attributes.url}` : ""} // Pass photoImage from the user data
        onFileChange={handleFileChange} // Pass handleFileChange function
      />
      {loading ? (
            <LoadingSpinner />
        ) : (
      <form onSubmit={handleSubmit}>
        <div className="container mx-auto px-4 py-8">

          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2">
              <TextField
                id="username"
                label="ชื่อผู้ใช้"
                variant="outlined"
                className="w-full bg-white"
                required
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>

            <div className="w-full md:w-1/2 px-2 mt-4">
              <TextField
                id="fullName"
                label="ชื่อ-นามสกุล"
                variant="outlined"
                className="w-full bg-white"
                required
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>

			      <div className="w-full md:w-1/2 px-2 mt-4">
              <TextField
                id="storeName"
                label="ชื่อร้านค้า"
                variant="outlined"
                className="w-full bg-white"
                required
                value={formData.storeName}
                onChange={handleInputChange}
              />
            </div>

            <div className="w-full md:w-1/2 px-2 mt-4">
              <TextField
                id="telNumber"
                label="เบอร์โทร"
                variant="outlined"
                className="w-full bg-white"
                required
                value={formData.telNumber}
                onChange={handleInputChange}
                inputProps={{
                  maxLength: 10, // จำกัดจำนวนหลักให้ไม่เกิน 10
                  pattern: "[0-9]*", // อนุญาตเฉพาะตัวเลข^0\d{9}$
                  inputMode: "numeric", // แสดงคีย์บอร์ดตัวเลขบนอุปกรณ์มือถือ
                  }}
                  error={formData.telNumber && formData.telNumber.length !== 10}
                  helperText={ formData.telNumber &&
                  formData.telNumber.length !== 10 ? "เบอร์โทรศัพท์มี 13 หลัก" : ""
                  }
              />
            </div>

            <div className="w-full px-2 mt-4">
              <FormControl>
                <FormLabel>เพศ*</FormLabel>
                <RadioGroup
                  row
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <FormControlLabel
                    value="Male"
                    control={<Radio />}
                    label="ชาย"
                  />
                  <FormControlLabel
                    value="Female"
                    control={<Radio />}
                    label="หญิง"
                  />
                </RadioGroup>
              </FormControl>
            </div>

            <div className="w-full px-2 mt-4">
              <TextField
                id="address"
                label="ที่อยู่"
                placeholder="ที่อยู่"
                multiline
                rows={4}
                className="w-full bg-white"
                required
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>

              <div className="w-full md:w-1/2 px-2 mt-4">
                <TextField
                  id="bookBankNumber"
                  label="เลขบัญชีธนาคาร"
                  variant="outlined"
                  className="w-full bg-white"
                  required
                  value={formData.bookBankNumber}
                  onChange={handleInputChange}
                  inputProps={{
                    maxLength: 15, // จำกัดให้กรอกไม่เกิน 15 หลัก
                    pattern: "[0-9]*", // อนุญาตให้กรอกเฉพาะตัวเลข
                    inputMode: "numeric", // แสดงคีย์บอร์ดตัวเลขบนมือถือ
                    }}
                    error={
                      (formData.bookBankNumber && (formData.bookBankNumber.length > 15 || formData.bookBankNumber.length < 10) &&
                      formData.bookBankNumber.length > 0)
                    }// แสดง error หากจำนวนหลักเกิน 15 หรือน้อยกว่า 10
                    helperText={ formData.bookBankNumber &&
                    formData.bookBankNumber.length > 15
                      ? "หมายเลขบัญชีธนาคารต้องไม่เกิน 15 หลัก"
                      : formData.bookBankNumber && formData.bookBankNumber.length < 10
                      ? "หมายเลขบัญชีธนาคารต้องมีอย่างน้อย 10 หลัก"
                      : ""
                    }
                  />
                </div>
         </div>
		<div className="w-full md:w-1/2 mt-4">
    <FormControl fullWidth>
      <InputLabel id="bank-select-label">ธนาคาร</InputLabel>
      <Select
        className="bg-white"
        labelId="bank-select-label"
        id="bankName"
        value={formData.bankName} // Use formData.bankName to match the state update
        label="ธนาคาร"
        onChange={handleSelectChange}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 200, // Adjust this value to control the dropdown height
            },
          },
        }}
      >
        {banks.map((bank) => (
          <MenuItem key={bank.id} value={bank.name}>
            {bank.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>



		</div>
		<div className="w-full px-2 mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
				ถ่ายหน้าบุ๊คแบงก์<span className="text-red-500">*</span>
              </label>
              {/* <WebcamCapture2 onCapture={handleImageCapture} id="bookBankImage"/> */}
              <CameraCapture
                onImageCaptured={handleImageCaptured}
                initialImage={shop?.bookBankImage?.attributes.url ? `${API_URL}${shop.bookBankImage.attributes.url}` : ""}
                // initialImage={formData.bookBankImage ? formData.bookBankImage : ""} // ใส่ URL ของภาพหรือ Data URL ที่ต้องการ
                id="bookBankImage"
              />
            </div>
          </div>
        <div className="container mx-auto px-4 mt-10 mb-5">
          <Checkbox
            id="checkedOne"
            checked={formData.checkedOne}
            onChange={handleInputChange}
            required
            sx={{ "& .MuiSvgIcon-root": { fontSize: 30 } }}
          />
          <span>
            <strong>กุ๊ก</strong>ให้ความสำคัญเกี่ยวกับความปลอดภัยข้อมูลของคุณ{" "}
            <span className="text-left leading-loose">
              และเพื่อให้คุณมั่นใจว่า
              กุ๊กมีความมุ่งมั่นที่จะให้ความคุ้มครองและดำเนินการด้วยความรับผิดชอบต่อการเก็บรวบรวม
              ใช้ เปิดเผย และโอนข้อมูลของคุณ กุ๊กจึงขอความยินยอมจากคุณ
            </span>
          </span>
        </div>
        <div className="container mx-auto px-4">
        {loading ? (
            <LoadingSpinner />
        ) : (
        <button
        type="submit"
        disabled={!isFormValid || !hasImageCard || !hasImageBank || showModal}
        className={`w-full h-12 mb-10 flex justify-center rounded-xl items-center text-white font-bold transition duration-300 ${
          isFormValid && !showModal
          ? "bg-green-500 hover:bg-green-600 active:bg-green-700"
          : "bg-slate-300 cursor-not-allowed"
          } ${isFormValid && !showModal ? "cursor-pointer" : ""}`}
          >
          บันทึกข้อมูล
        </button>
        )}
        </div>
      </form>
      )}
    </ThemeProvider>
    </>
  );
}

export default UpdateShopProfile;
