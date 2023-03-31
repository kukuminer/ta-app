import React from "react";
import { useNavigate } from "react-router-dom"
import getUser from "../../getUser";
import "./header.css"

const Header = () => {
    const navigate = useNavigate()
    const userId = getUser()
    const [userType, setUserType] = React.useState(null);

    React.useEffect(() => {
        fetch('/api/user/' + userId)
            .then((res) => res.json())
            .then((data) => {
                setUserType(data.userType)
                console.log(data)
            })
    }, [userId])

    const logoutHandler = () => {
        localStorage.removeItem('userId')
        navigate('/')
    }

    return (
        <div className="header-container">
            <div className="header">
                <h1 className="header-left">
                    DASHBOARD
                </h1>
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