import React from "react";
import axios from "axios";
import ProfessorDash from "./professor/professor_dash";
import StudentDash from "./student/student_dash";
import AdminDash from "./admin/admin_dash";
import Header from "../header/header"
import getUser from "../../getUser";
import "./dashboard.css"

const components = {
    'professor': <ProfessorDash />,
    'student': <StudentDash />,
    'admin': <AdminDash />,
}

const Dashboard = () => {
    // var user
    const userId = getUser()
    const [userType, setUserType] = React.useState(null);

    React.useEffect(() => {
        axios.get('/api/usertype/' + userId)
            .then((res) => {
                setUserType(res.data.usertype)
            })
    }, [userId])


    return (
        <>
            <Header />
            {/* Backend only accepts userId as arg, so even if userType is
            modified, secure content will remain secure since it gets 
            re-checked in the backend */}
            <div className="dashboard">
                <div className="main">
                    {components[userType]}
                </div>
            </div>
        </>
    );
};

export default Dashboard;