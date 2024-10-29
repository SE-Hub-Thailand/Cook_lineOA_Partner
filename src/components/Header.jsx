import { NavLink } from "react-router-dom";
import logo from "../assets/images/Group.png";
import "./style.css";
import React, { useState, useEffect, useContext } from "react";
import { useLiff } from 'react-liff';
import { BsBasket2 } from "react-icons/bs";
import { BsCoin } from "react-icons/bs";
import { getUser } from "../api/strapi/userApi"; // Import getUser function
import { CartContext } from "./CartContext"; // Import CartContext for cart items
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
// import { getAllHistoryPoints } from "../api/strapi/historyPointApi";
import Alert from './Alert';
import { getAllRedeems } from "../api/strapi/redeemApi";

function Header() {
  // function Header() {

  const storedCounts = localStorage.getItem('cart');
  const updateCounts = localStorage.getItem('cart2');

  // console.log("storedCounts in header: ", storedCounts);

  // console.log("updateCounts in header: ", updateCounts);
  // const user_local = localStorage.getItem('user');
  let totalItems = 0;

  if (storedCounts) {
    const counts = JSON.parse(storedCounts); // Parse the JSON string into an object
    totalItems = Object.values(counts).reduce((acc, count) => acc + count, 0);
  }
  console.log("totalItems in header: ", totalItems);
  const userId = localStorage.getItem('lineId');
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const {liff } = useLiff();
  // const token = import.meta.env.VITE_TOKEN_TEST;
  const token = localStorage.getItem('token');
  const [user, setUser] = useState(null);
  const [points, setHistoryPoints] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { cartItems } = useContext(CartContext); // Access cart items from CartContext
  console.log("cartItems in header: ", cartItems);
  const [clicked, setClicked] = useState(false); // For mobile menu toggle


  const navigate = useNavigate();


  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await getUser(userId, token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        // localStorage.setItem('user', JSON.stringify(userData));

        const pointsData = await getAllRedeems(userData?.id, token);
        setHistoryPoints(pointsData.length > 0 ? pointsData : []);
        console.log("pointsData in header: ", pointsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError(error.message);
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId, token]);

  // localStorage.setItem('user', JSON.stringify(user));



  if (user?.point )
    localStorage.setItem('point', user.point);
  // Handle mobile menu toggle
  const handleClick = () => {
    setClicked((prevState) => !prevState);
  };
  const handleBasketClick = () => {
    // Navigate to the CartSummary route
    if (totalItems === 0)
      setShowModal(true);
    else
    {
      localStorage.setItem('totalItems', totalItems);
      navigate('/cart', { state: { storedCounts, cartItems } });

    }

  };
  const handleCoinClick = () => {
    // Navigate to the CartSummary route
    if (points.length === 0)
      setShowModal2(true);
    else
      navigate(`/history-point/${user?.id}`);
  };

  const handleLogout = () => {
    if (liff) {
        liff.logout();
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/'); // Redirect to login page
  };
  // Loading and Error handling
  if (loading) return <LoadingSpinner />
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <nav className="flex items-center justify-between p-5 pr-20 bg-white">
        <NavLink to="/home">
          <img src={logo} alt="Logo" width={50} />
        </NavLink>

        {/* Basket Icon and Count */}
          <div className="flex items-center relative">
            <BsBasket2 className="w-10 h-10 text-green-700 ml-10" onClick={handleBasketClick}/>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>


        {/* Coin Icon and Balance */}
        {/* <NavLink to={`/history-point/${user?.id}`} > */}
          <div className="flex flex-col items-center">
            <BsCoin className="w-7 h-7 text-yellow-hard ml-8" onClick={handleCoinClick}/>
            <p className="ml-6 mt-2">
              <strong>{user?.point ?? 0}</strong>
            </p>
          </div>
        {/* </NavLink> */}

        <div>
          <ul id="navbar" className={clicked ? "navbar open" : "navbar"}>
            <li>
              <NavLink
                className="font-semibold hover:text-yellow-hard"
                to="/partner/update-shop-profile"
                style={({ isActive }) => {
                  return { color: isActive ? "yellow-hard" : "" };
                }}
              >
                ข้อมูลส่วนตัว
              </NavLink>
            </li>
            <li>
              <NavLink
                className="font-semibold hover:text-yellow-hard"
                to={`/history-point/${user?.id}`}
                style={({ isActive }) => {
                  return { color: isActive ? "yellow-hard" : "" };
                }}
              >
                คะแนนสะสมและประวัติการแลกแต้ม
              </NavLink>
            </li>
            <li>
              <NavLink
                className="font-semibold hover:text-yellow-hard"
                to={`/history-service-machine/${user?.id}`}
                style={({ isActive }) => {
                  return { color: isActive ? "yellow-hard" : "" };
                }}
              >
                ประวัติการใช้บริการตู้
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={handleLogout}
                className="font-semibold hover:text-yellow-hard"
                to={'/'}
                style={({ isActive }) => {
                  return { color: isActive ? "yellow-hard" : "" };
                }}
              >
                ออกจากระบบ
              </NavLink>
            </li>
          </ul>
        </div>

        <div id="mobile" onClick={handleClick}>
          <i id="bar" className={clicked ? "fas fa-times" : "fas fa-bars"}></i>
        </div>
      </nav>

      {showModal &&
        <Alert title="No items in the cart." message="Please add some products to proceed." closeModal={() => setShowModal(false)} />
      }
      {showModal2 &&
        <Alert title="No Point Redemption Records." message="Please make a redemption to view your history." closeModal={() => setShowModal2(false)} />
      }

    </>
  );
}

export default Header;
