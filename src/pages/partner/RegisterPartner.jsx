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
import { createUser, getUser, updateUser } from "../../api/strapi/userApi"; // Import createUser function
import { createShop } from "../../api/strapi/shopApi"; // Import createShop function
import Alert from "../../components/Alert.jsx";
import { getAllBank } from "../../api/strapi/bankApi"; // Import getAllBank function
// import { uploadImage } from "../api/strapi/uploadApi"; // Import uploadImage function
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { handlePhotoUpload, uploadImageFromBase64 } from "../../api/strapi/uploadApi";
import WebcamCapture2 from "../../components/WebcamCapture2";
import CameraCapture from "../../components/CameraCapture";

function RegisterPartner() {
  const { id } = useParams();
  const displayName = localStorage.getItem('displayName');
  const pictureUrl = localStorage.getItem('pictureUrl');
  console.log("displayName in Register: ", displayName);
  console.log("pictureUrl in Register: ", pictureUrl);
  // console.log("token in Register: ", token);
  const userId = localStorage.getItem('lineId');
  console.log("userId in Register: ", userId);
  // if (id === 1) {
  //   const token = localStorage.getItem('token');
  // }
  const theme = createTheme({
    typography: {
      fontFamily: "Sarabun",
    },
  });

  const navigate = useNavigate(); // Initialize useNavigate for redirection
  const [isFormValid, setIsFormValid] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [banks, setBanks] = useState([]);
  const [user, setUser] = useState([]);
  const [response_user, setResponse_user] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [hasImageCard, setHasImageCard] = useState(true);  // สถานะว่ามีภาพหรือไม่
  const [hasImageBank, setHasImageBank] = useState(true); 
  const [dataCardImage, setDataCardImage] = useState(null); 
  const [dataBankImage, setDataBankImage] = useState(null); 
  const [capturedImage, setCapturedImage] = useState(null);
  const [formData, setFormData] = useState({
    username: displayName,
    password: "",
    storeName: "",
    fullName: "",
    telNumber: "",
    gender: "",
    address: "",
    cardID: "",
    cardIdImage: "",
    bookBankNumber: "",
    bankName: "",
    bookBankImage: "",
    photoImage: pictureUrl || "",
    checkedOne: false,
});

useEffect(() => {
    const fetchBanks = async () => {
        try {
            setLoading(true);
            const bankData = await getAllBank();
            setBanks(bankData);

            if (id === 1) {
                console.log("userId in Register: ", userId);
                console.log("token in Register: ", token);

                const userDataString = localStorage.getItem('user');
                const userData = userDataString ? JSON.parse(userDataString) : null;
                setToken(localStorage.getItem('token'));
                if (userData) {
                    console.log("userData in Register: ", userData);
                    setUser(userData);

                    // Update formData based on userData
                    setFormData(prevFormData => ({
                        ...prevFormData,
                        username: userData.username || "",
                        fullName: userData.fullName || "",
                        telNumber: userData.telNumber || "",
                        gender: userData.gender || "",
                        address: userData.address || "",
                        cardID: userData.cardID || "",
                        photoImage: userData.photoImage || "",
                        cardIdImage: userData.cardIdImage || "",
                    }));
                }
            }

        } catch (error) {
            setError("Error: Cannot fetch bank data.");
        } finally {
            setLoading(false);
        }
    };

    fetchBanks();
}, [error, token, userId, id]);

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
      bankName &&
        // cardIdImage &&
        // hasImage &&
        checkedOne
    );
  }, [formData]);

  // Function to handle file change from FileUpload component
  const handleFileChange = (file) => {
    console.log("file change: ", file);
    setFormData((prevData) => ({
      ...prevData,
      photoImage: file, // Store the file in formData
    }));
  };

  // Handle select input changes separately
  const handleSelectChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      bankName: event.target.value,
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
    if (formData.photoImage) {
      const { url, id } = await handlePhotoUpload(formData.photoImage);
      imageId = id;
      // ใช้ URL ของรูปภาพและ ID ที่ได้จากการอัปโหลดใน formData หรืออื่น ๆ
      formData.photoImage = url;
      console.log("Uploaded Image URL:", url);
      console.log("Uploaded Image ID:", id);
    }
    // const base64Image = localStorage.getItem('cardIdImage');
    const cardIdImageObject = await uploadImageFromBase64(dataCardImage)
    if (cardIdImageObject) {
      cardId_id = cardIdImageObject.id;
      formData.cardIdImage = cardIdImageObject.url;
    }
	// const base64Image2 = localStorage.getItem('bookBankImage');
    const bookBankImageObject = await uploadImageFromBase64(dataBankImage)
    if (bookBankImageObject) {
	    bookBank_id = bookBankImageObject.id;
      formData.bookBankImage = bookBankImageObject.url;
    }

    setLoading(true); // Start loading
      const userData = {
      username: formData.username || "cook" + userId ,
      email: "cook" + userId + "@cook.com", // Assuming email is the same as username in this example
      password: "cookcook",
      lineId: userId,
      userType: "customer",
      photoImage: imageId === 0 ? null : imageId,
      cardIdImage: cardId_id === 0 ? null : cardId_id,
	    bookBankImage: bookBank_id === 0 ? null : bookBank_id,
	    // storeName: formData.storeName,
      fullName: formData.fullName,
      telNumber: formData.telNumber,
      gender: formData.gender,
      address: formData.address,
      cardID: formData.cardID,
      point: 0,
      // shop: {
      //   name: formData.storeName
      // }
    };
    console.log("id param: ", id);
    console.log("userData before: ", userData);
    console.log("token before: ", token);
    // const response_user = checkUser(id, userId, userData);
    if (id == 0) {
      console.log("id: ", id);
      const response_user = await createUser(userData);
      if (response_user.jwt !== undefined) {
        console.log("createSuccessful response_user.jwt : ", response_user.jwt );
        localStorage.setItem('token', response_user.jwt);
        setToken(localStorage.getItem('token'));
        setResponse_user(response_user);

        const get_user = await getUser(userId, response_user.jwt);
        console.log("get_user.id: ", get_user.id);
        const shopData = {
          user: get_user.id,
          image: imageId === 0 ? null : imageId,
          bookBankImage: bookBank_id === 0 ? null : bookBank_id,
          name: formData.storeName,
          location: formData.address,
          bookBankNumber: formData.bookBankNumber,
          bankName: formData.bankName,
        };
        const response_shop = await createShop(shopData);
        if (response_shop) {
          // console.log("response_shop.jwt : ", response_shop.jwt );
          console.log("response_user.id: ", response_user.id);
          console.log("User registered successfully!");
          console.log("token after: ", token);
          console.log("localStorage.getItem('token'): ", localStorage.getItem('token'));
          const response = await updateUser(get_user.id, {userType: "shop"}, response_user.jwt);
          if (response)
            setShowModal(true);
        }
      }
    } else if (id == 1) {
      console.log("id: ", id);
      console.log("token: ", token);
      const get_user = await getUser(userId, token);
      if (get_user && get_user.id) {
        const response_user = await updateUser(get_user.id, userData, token);
        console.log("response_user : ", response_user );
        setResponse_user(response_user);
        const get_user = await getUser(userId, token);
        console.log("get_user.id: ", get_user.id);
        const shopData = {
          user: get_user.id,
          image: imageId === 0 ? null : imageId,
          bookBankImage: bookBank_id === 0 ? null : bookBank_id,
          name: formData.storeName,
          location: formData.address,
          bookBankNumber: formData.bookBankNumber,
          bankName: formData.bankName,
        };
        const response_shop = await createShop(shopData);
        if (response_shop) {
          console.log("response_shop.jwt : ", response_shop.jwt );
          console.log("User registered successfully!");
          const response = await updateUser(response_user.id, {userType: "shop"}, token);
          if (response)
            setShowModal(true);
        }
      }
    }  else {
      throw new Error('User registration failed.');
    }
    // if (response_user) {
    //   console.log("response_user: ", response_user);
    //   console.log("token after: ", token);
    //   const get_user = await getUser(userId, token);
    //   console.log("get_user.id: ", get_user.id);
    //   const shopData = {
    //     user: get_user.id,
    //     image: imageId === 0 ? null : imageId,
    //     bookBankImage: bookBank_id === 0 ? null : bookBank_id,
    //     name: formData.storeName,
    //     location: formData.address,
    //     bookBankNumber: formData.bookBankNumber,
    //     bankName: formData.bankName,
    //   };
    //   const response_shop = await createShop(shopData);
    //   if (response_shop) {
    //     console.log("response_shop.jwt : ", response_shop.jwt );
    //     console.log("User registered successfully!");
    //     const response = await updateUser(response_user.id, {userType: "shop"}, token);
    //     if (response)
    //       setShowModal(true);
    //   }
      // else {
      //   throw new Error('User registration failed.');
      // }
    // } else {
    //   throw new Error('User registration failed.');
    // }
  };

  if (loading) return <LoadingSpinner />; // Loading state
  if (error) return <p>Error: {error}</p>; // Error state

  return (
    <>
      { showModal &&
      <>
        <Alert
          title="User registered successfully!"
          message={`Welcome, ${formData.username}! We’re so happy to have you on Cook Website.`}
          path="/partner/add-product"
          status="success"
        />
      </>
      }
    <ThemeProvider theme={theme}>
      <FileUpload
        photoImage={formData.photoImage} // Pass the selected photo to FileUpload component
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
                  pattern: "[0-9]*", // อนุญาตเฉพาะตัวเลข
                  inputMode: "numeric", // แสดงคีย์บอร์ดตัวเลขบนอุปกรณ์มือถือ
                }}
                error={
                  formData.telNumber &&
                  (formData.telNumber.length !== 10 || !/^0[0-9]{9}$/.test(formData.telNumber))
                }
                helperText={
                  formData.telNumber && !/^[0-9]+$/.test(formData.telNumber)
                    ? "กรุณากรอกเฉพาะตัวเลขเท่านั้น"
                    : formData.telNumber && formData.telNumber.length !== 10
                    ? "เบอร์โทรศัพท์ต้องมี 10 หลัก"
                    : formData.telNumber && !/^0[0-9]{9}$/.test(formData.telNumber)
                    ? "เบอร์โทรศัพท์ต้องเริ่มต้นด้วยเลข 0"
                    : ""
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

            <div className="w-full px-2 mt-4">
              <TextField
                id="cardID"
                label="หมายเลขบัตรประจำตัวประชาชน"
                variant="outlined"
                className="w-full bg-white"
                required
                value={formData.cardID}
                onChange={handleInputChange}
                inputProps={{
                  maxLength: 13, // จำกัดจำนวนหลักให้ไม่เกิน 13
                  pattern: "[0-9]*", // อนุญาตเฉพาะตัวเลข
                  inputMode: "numeric", // แสดงคีย์บอร์ดตัวเลขบนอุปกรณ์มือถือ
                  }}
                  error={
                    formData.cardID &&
                    (formData.cardID.length !== 13 || !/^[0-9]+$/.test(formData.cardID))
                  }
                  helperText={
                    formData.cardID && !/^[0-9]+$/.test(formData.cardID)
                    ? "กรุณากรอกเฉพาะตัวเลขเท่านั้น"
                    : formData.cardID && formData.cardID.length !== 13
                    ? "หมายเลขบัตรประจำตัวต้องมี 13 หลัก"
                    : ""
                  }
                />
              </div>
              <div className="w-full px-2 mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                  ถ่ายรูปตนเองพร้อมถือบัตรประจำตัวประชาชน<span className="text-red-500">*</span>
                </label>
                {/* <WebcamCapture2 onCapture={handleImageCapture} id="cardIdImage"/> */}
                <CameraCapture
                  onImageCaptured={handleImageCaptured}
                  initialImage="" // ใส่ URL ของภาพหรือ Data URL ที่ต้องการ
                  id="cardIdImage"
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
          value={formData.bank}
          label="ธนาคาร"
          onChange={handleSelectChange}
          MenuProps={{
              PaperProps: {
                  style: {
                      maxHeight: 200,  // Adjust this value to control the dropdown height
                  },
              },
          }}
      >
          {banks.map((bank) => (
              <MenuItem key={bank.id} value={bank.id}>
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
                initialImage="" // ใส่ URL ของภาพหรือ Data URL ที่ต้องการ
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
            isFormValid && hasImageCard && hasImageBank && !showModal
              ? "bg-green-500 hover:bg-green-600 active:bg-green-700"
              : "bg-slate-300 cursor-not-allowed"
          } ${isFormValid && hasImageCard && hasImageBank && !showModal ? "cursor-pointer" : ""}`}
        >
          ลงทะเบียน
        </button>
        )}
        </div>
      </form>
      )}
    </ThemeProvider>
    </>
  );
}

export default RegisterPartner;
