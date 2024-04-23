import React from "react";
import ProfessorDash from "./professor/professor_dash";
import StudentDash from "./student/student_dash";
import AdminDash from "./admin/admin_dash";
import Header from "../header/header";
import "./dashboard.css";
import { wget } from "../requestWrapper";
import { useNavigate } from "react-router-dom";
// import ProfileView from "./student/profile_view";

const components = {
  instructor: <ProfessorDash />,
  applicant: <StudentDash />,
  admin: <AdminDash />,
};

const Dashboard = () => {
  const [userType, setUserType] = React.useState(null);
  const nav = useNavigate();

  React.useEffect(() => {
    wget(nav, "/api/userdata").then((res) => {
      setUserType(res.data.usertype);
    });
  }, [nav]);

  return (
    <>
      <Header />
      {/* <ProfileView /> */}
      {/* Backend only accepts userId as arg, so even if userType is
            modified, secure content will remain secure since it gets 
            re-checked in the backend */}
      <div className="dashboard">
        <div className="main">{components[userType]}</div>
      </div>
    </>
  );
};

export default Dashboard;
