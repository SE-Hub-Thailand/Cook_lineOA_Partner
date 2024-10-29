import { NavLink } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import "../style.css"
import { useLiff } from 'react-liff';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import LoadingSpinner from '../LoadingSpinner';
function Header() {
    const userId = localStorage.getItem('lineId');
    // const userId = import.meta.env.VITE_USER_ID;
    const navigate = useNavigate();

    const {liff } = useLiff();
    const token = localStorage.getItem('token');
    // const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [clicked, setClicked] = useState(false); // For mobile menu toggle


    const handleClick = () => {
        setClicked((prevState) => !prevState);
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
//   if (loading) return <LoadingSpinner />
  if (error) return <p>Error: {error}</p>;
    return(
        <>
            <nav className="flex items-center justify-between p-5 pr-20 bg-white">
                <NavLink
                    className="font-semibold hover:text-yellow-hard"
                    to="/partner/add-product"
                    style= {({ isActive }) => {
                        return { color: isActive ? "yellow-hard" : ""};
                    }}
                >
                    <img src={logo} alt="Logo" width={50} />
                    {/* <p>ข้อมูลร้านค้า</p> */}
                </NavLink>
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
                            to={`/partner/qr-reader`}
                            style={({ isActive }) => {
                            return { color: isActive ? "yellow-hard" : "" };
                            }}
                        >
                            สแกน QR Code
                        </NavLink>
                        </li>
                        <li>
                        <NavLink
                            className="font-semibold hover:text-yellow-hard"
                            to={`/partner/get-money-item`}
                            style={({ isActive }) => {
                            return { color: isActive ? "yellow-hard" : "" };
                            }}
                        >
                            ประวัติการแลกแต้ม
                        </NavLink>
                        </li>
                        <li>
                        <NavLink
                            className="font-semibold hover:text-yellow-hard"
                            to={`/partner/get-product-item`}
                            style={({ isActive }) => {
                            return { color: isActive ? "yellow-hard" : "" };
                            }}
                        >
                            ประวัติการเพิ่มสินค้า
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
        </>
    );
}
export default Header;
