import Container from "@mui/material/Container";
import { NavLink } from "react-router-dom";
import logo from "../../assets/images/logo.png";

export default function Approval() {

  return (
    <>
      {/* <Header /> */}
      <nav className="flex items-center justify-between p-5 pr-20 bg-white">
          <NavLink
              className="font-semibold hover:text-yellow-hard"
              to="/partner/add-product"
              style= {({ isActive }) => {
                  return { color: isActive ? "yellow-hard" : ""};
              }}
          >
              <img src={logo} alt="Logo" width={50} />
          </NavLink>
      </nav>
      <Container maxWidth="sm">
        <div className="w-full h-auto bg-white rounded-md p-5 mt-10 text-justify leading-loose">
          <p>
             🔒 Your account is pending approval by the admin. Please wait for confirmation before logging in. 🕰️✨
          </p>
        </div>
      </Container>
    </>
  );
}
