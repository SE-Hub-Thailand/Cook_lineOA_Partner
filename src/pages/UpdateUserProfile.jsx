import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import FileUpload from "../components/FileUpload.jsx";
import { Checkbox, TextField } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { updateUser } from "../api/strapi/userApi"; // Import updateUser function
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import WebcamCapture from "../components/WebcamCapture.jsx";
import Alert from "../components/Alert.jsx";
import { handlePhotoUpload, uploadImageFromBase64 } from "../api/strapi/uploadApi";

function UpdateUserProfile() {
  const userId = localStorage.getItem('lineId');
  // const token = import.meta.env.VITE_TOKEN_TEST;
  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate(); // Initialize useNavigate for redirection
  const [isFormValid, setIsFormValid] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasImage, setHasImage] = useState(false);  // สถานะว่ามีภาพหรือไม่
  const [showModal, setShowModal] = useState(false);
  const [fileChange, setFileChange] = useState(false);

  const theme = createTheme({
    typography: {
      fontFamily: "Sarabun",
    },
  });

    // Fetch user data and set the formData
    useEffect(() => {
      const fetchUser = async () => {
        try {
          setLoading(true);
          // const userData = await getUser(userId, token);
          const userData = JSON.parse(localStorage.getItem('user'));
          setUser(userData);
          setFormData({
            username: userData.username || "",
            fullName: userData.fullName || "",
            telNumber: userData.telNumber || "",
            gender: userData.gender || "",
            address: userData.address || "",
            cardID: userData.cardID || "",
            photoImage: userData.photoImage || "", // Assuming the image is not fetched here
            cardIdImage: userData.cardIdImage || "",
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

  // Initial formData state is set with empty fields
  const [formData, setFormData] = useState({
    username: user?.username || "",
		fullName: user?.fullName || "",
    telNumber: user?.telNumber || "",
    gender: user?.gender || "",
    address: user?.address || "",
    cardID: user?.cardID || "",
    photoImage: user?.photoImage || "", // Assuming the image is not fetched here
    cardIdImage: user?.cardIdImage || "",
    checkedOne: false,
  });

  useEffect(() => {
    const {
      username,
      fullName,
      telNumber,
      gender,
      address,
      cardID,
      checkedOne,
    } = formData;

    setIsFormValid(
      username &&
        fullName &&
        telNumber &&
        gender &&
        address &&
        cardID &&
        // hasImage &&
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
    let imageId, cardId_id = 0;
    if (fileChange && formData.photoImage) {
      const { url, id } = await handlePhotoUpload(formData.photoImage);
      imageId = id;
      // ใช้ URL ของรูปภาพและ ID ที่ได้จากการอัปโหลดใน formData หรืออื่น ๆ
      formData.photoImage = url;
      console.log("Uploaded Image URL:", url);
      console.log("Uploaded Image ID:", id);
    }
    if (hasImage) {
      const base64Image = localStorage.getItem('cardIdImage');
      const cardIdImageObject = await uploadImageFromBase64(base64Image)
      if (cardIdImageObject) {
        cardId_id = cardIdImageObject.id;
        formData.cardIdImage = cardIdImageObject.url;
      }
    }

      const userData = {
      username: formData.username ,
      photoImage: imageId === 0 ? user?.photoImage : imageId,
      cardIdImage: !hasImage ? user?.cardIdImage : cardId_id,
      fullName: formData.fullName,
      telNumber: formData.telNumber,
      gender: formData.gender,
      address: formData.address,
      cardID: formData.cardID,
    };
    console.log("userData before: ", userData);

    const response = await updateUser(user?.id, userData, token);
    console.log("response: ", response);
    console.log("response tok: ", response.jwt);
    // console.log("response ok: ", response.ok);
    if (response) {
      console.log("User updated successfully!");
      setShowModal(true);
    } else {
      throw new Error('User update failed.');
    }
  };

  const handleImageCapture = (imageSrc) => {
    console.log("imageSrc: ", imageSrc);
    if (imageSrc) {
      setHasImage(true);  // มีภาพอยู่
      // setFormData((prevData) => ({
      //   ...prevData,
      //   cardIdImage: imageSrc,
      // }));
    } else {
      setHasImage(false);  // ไม่มีภาพ
    }
  };

  if (loading) return <LoadingSpinner />; // Loading state
  if (error) return <p>Error: {error}</p>; // Error state

  return (
    <>
    { showModal &&
      <>
        <Alert
          title="User data updated successfully!"
          message={`Hi, ${formData.username}! Your information has been updated successfully.`}
          path="/home"
        />
      </>
      }
    <ThemeProvider theme={theme}>
      <Header />
	  <FileUpload
	  	//  photoImage={user?.photoImage?.url}
	  	photoImage={user?.photoImage?.url ? `${API_URL}${user.photoImage.url}` : ""} // Pass photoImage from the user data
        onFileChange={handleFileChange} // Pass handleFileChange function
      />
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
                id="telNumber"
                label="เบอร์โทร"
                variant="outlined"
                className="w-full bg-white"
                required
                value={formData.telNumber}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-full px-2 mt-4">
              <FormControl>
                <FormLabel>เพศ</FormLabel>
                <RadioGroup
                  row
                  name="gender"
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
              />
            </div>
            <div className="w-full px-2 mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                ถ่ายรูปตนเองพร้อมถือบัตรประจำตัวประชาชน
              </label>
              <WebcamCapture onCapture={handleImageCapture} />
            </div>
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
          <button
            type="submit"
            disabled={!isFormValid || showModal}
            className={`w-full h-12 mb-10 flex justify-center rounded-xl items-center text-white font-bold transition duration-300 ${
              isFormValid && !showModal
                ? "bg-green-500 hover:bg-green-600 active:bg-green-700"
                : "bg-slate-300 cursor-not-allowed"
            } ${isFormValid && !showModal ? "cursor-pointer" : ""}`}
          >
            บันทึกข้อมูล
          </button>
        </div>
      </form>
    </ThemeProvider>
    </>
  );
}

export default UpdateUserProfile;
