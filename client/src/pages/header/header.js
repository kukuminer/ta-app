import React from "react";
import { useNavigate, Link } from "react-router-dom"
import getUser from "../../getUser";
import "./header.css"

const Header = () => {
    const navigate = useNavigate()
    const userId = getUser()
    const [userType, setUserType] = React.useState(null);

    React.useEffect(() => {
        fetch('/api/usertype/' + userId)
            .then((res) => res.json())
            .then((data) => {
                setUserType(data.userType)
            })
    }, [userId])

    const logoutHandler = () => {
        localStorage.removeItem('userId')
        navigate('/')
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
                    This app is currently in testing. No user actions are officially submitted
                </p>
                <p className="header-right">
                    userId: {userId}
                    <br />
                    userType: {userType ? userType : 'loading..'}
                    <br />
                    <button onClick={logoutHandler} >Logout</button>
                </p>
            </div>
        </div>
    )
}

export default Header