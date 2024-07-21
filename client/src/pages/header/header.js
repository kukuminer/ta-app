import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./header.css";
import { wget } from "../requestWrapper";

// Import local image file
import logoImage from "../../images/yorku-logo.jpg";

const Header = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await wget(navigate, "/api/userdata");
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [navigate]);

  const logoutHandler = () => {
    localStorage.removeItem("userId");
    navigate("https://passportyork.yorku.ca/ppylogin/ppylogout");
  };

  const profileHandler = () => {
    navigate("/profile");
  };

  return (
    <div className="header-container">
      <div className="header">
        <Link to="/dashboard" className="header-left">
          <img src={logoImage} alt="Logo" className="header-logo" />
          <h1>TA Preferences Dashboard</h1>
        </Link>
        <p className="header-left">
          {/* This app is currently in testing. No user actions are officially submitted */}
        </p>
        <div className="header-right">
          {userData ? (
            <>
              <p>
                User Id: {userData.username}
                <br />
                Role: {userData.usertype}
              </p>
              <button onClick={profileHandler}>Profile</button>
              <a href="https://passportyork.yorku.ca/ppylogin/ppylogout">
                <button onClick={logoutHandler}>Logout</button>
              </a>
            </>
          ) : (
            <p>Loading user data...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
