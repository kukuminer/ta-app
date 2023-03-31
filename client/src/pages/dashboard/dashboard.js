import React from "react";
import { useNavigate } from "react-router-dom"
import ProfessorDash from "./professor/professor_dash";
import StudentDash from "./student_dash";
import AdminDash from "./admin_dash";
import "./dashboard.css"

const components = {
    'professor': <ProfessorDash />,
    'student': <StudentDash />,
    'admin': <AdminDash />,
}

const Dashboard = () => {
    // var user

    const userId = localStorage.getItem('userId');
    const [userType, setUserType] = React.useState(null);
    const navigate = useNavigate()

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
        <div className="dashboard">
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
            {/* Backend only accepts userId as arg, so even if userType is
            modified, secure content will remain secure since it gets 
            re-checked in the backend */}
            <div className="main">
                {components[userType]}
            </div>
        </div>
    );
};

export default Dashboard;