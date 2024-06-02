import React from "react";
import Header from "../header/header";
import StudentApplication from "./student/student_application";
import "./application.css";

const components = {
  applicant: <StudentApplication />,
  professor: null,
  admin: null,
};

const Application = () => {
  const [userType, setUserType] = React.useState(null);

  React.useEffect(() => {
    fetch("/api/userdata")
      .then((res) => res.json())
      .then((data) => {
        setUserType(data.usertype);
      });
  }, []);

  return (
    <>
      <Header />
      <div className="application-page">
        <div className="main">{!!userType && components[userType]}</div>
      </div>
    </>
  );
};

export default Application;
