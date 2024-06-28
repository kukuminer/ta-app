import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../header/header";
import ProfessorSection from "./professor/professor_section";
import "./section.css";

const components = {
  student: null,
  instructor: <ProfessorSection />,
  admin: null,
};

const Section = () => {
  const { sectionId } = useParams();

  const [userType, setUserType] = useState(null);
  const [secData, setSecData] = useState(null);

  useEffect(() => {
    fetch("/api/userdata")
      .then((res) => res.json())
      .then((data) => {
        setUserType(data.usertype);
      });
  }, []);

  useEffect(() => {
    fetch("/api/section/" + sectionId)
      .then((res) => res.json())
      .then((data) => {
        setSecData(data[0]);
      });
  }, [sectionId]);

  return (
    <>
      <Header />
      <div className="section">
        <div className="main">
          {secData ? (
            <h1>
              SECTION {secData.course} {secData.letter} (
              {secData.campus.toUpperCase()})
            </h1>
          ) : (
            <h1>Loading...</h1>
          )}
          {components[userType]}
        </div>
      </div>
    </>
  );
};

export default Section;
