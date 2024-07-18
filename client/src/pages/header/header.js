import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./header.css";
import { wget } from "../requestWrapper";

const Header = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = React.useState(null);

  React.useEffect(() => {
    wget(navigate, "/api/userdata").then((res) => {
      setUserData(res.data);
    });
  }, [navigate]);

  const logoutHandler = () => {
    localStorage.removeItem("userId");
    navigate("/https://passportyork.yorku.ca/ppylogin/ppylogout");
  };
  const profileHandler = () => {
    navigate("/profile");
  };

  return (
    <div className="header-container">
      <div className="header">
        <Link to="/dashboard">
          <h1 className="header-left">TA Preferences Dashboard</h1>
        </Link>
        <p>
          {/* This app is currently in testing. No user actions are officially submitted */}
        </p>
        <p className="header-right">
          User Id: {userData ? userData?.username : "loading.."}
          <br />
          Role: {userData ? userData?.usertype : "loading.."}
          <br />
          <button onClick={profileHandler}>Profile</button>
          <a href="https://passportyork.yorku.ca/ppylogin/ppylogout">
            <button onClick={logoutHandler}>Logout</button>
          </a>
        </p>
      </div>
    </div>
  );
};

export default Header;
