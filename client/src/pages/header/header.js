import React from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"
import "./header.css"

const Header = () => {
    const navigate = useNavigate()
    const [userData, setUserData] = React.useState(null);

    React.useEffect(() => {
        axios.get('/api/userdata')
            .then((res) => {
                setUserData(res.data)
            })
    }, [])

    const logoutHandler = () => {
        localStorage.removeItem('userId')
        navigate('/https://passportyork.yorku.ca/ppylogin/ppylogout')
    }
    const profileHandler = () => {
        navigate('/profile')
    }

    return (
        <div className="header-container">
            <div className="header">
                <Link to='/dashboard'>
                    <h1 className="header-left">
                        DASHBOARD
                    </h1>
                </Link>
                <p>
                    {/* This app is currently in testing. No user actions are officially submitted */}
                </p>
                <p className="header-right">
                    User Id: {userData ? userData?.username : 'loading..'}
                    <br />
                    Role: {userData ? userData?.usertype : 'loading..'}
                    <br />
                    <button onClick={profileHandler} >Profile</button>
                    <a href="https://passportyork.yorku.ca/ppylogin/ppylogout">
                        <button onClick={logoutHandler} >Logout</button>
                    </a>
                </p>
            </div>
        </div>
    )
}

export default Header