import React from "react";
import axios from "axios";
import ProfessorDash from "./professor/professor_dash";
import StudentDash from "./student/student_dash";
import AdminDash from "./admin/admin_dash";
import Header from "../header/header"
import "./dashboard.css"
// import ProfileView from "./student/profile_view";

const components = {
    'instructor': <ProfessorDash />,
    'applicant': <StudentDash />,
    'admin': <AdminDash />,
}

const Dashboard = () => {
    const [userType, setUserType] = React.useState(null);

    React.useEffect(() => {
        axios.get('/api/usertype')
            .then((res) => {
                setUserType(res.data.usertype)
            })
    }, [])


    return (
        <>
            <Header />
            {/* <ProfileView /> */}
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