import React from "react"
import { useParams } from 'react-router-dom'
import Header from "../header/header"
import getUser from "../../getUser"
import ProfessorSection from "./professor/professor_section"
import StudentSection from "./student/student_section"

const components = {
    'student': <StudentSection />,
    'professor': <ProfessorSection />,
    'admin': null,
}

const Section = () => {
    const { sectionId } = useParams()
    const userId = getUser()

    const [userType, setUserType] = React.useState(null);
    const [course, setCourse] = React.useState(null);
    const [letter, setLetter] = React.useState(null);

    React.useEffect(() => {
        fetch('/api/user/' + userId)
            .then((res) => res.json())
            .then((data) => {
                setUserType(data.userType)
            })
    }, [userId])

    React.useEffect(() => {
        fetch('/api/section/' + sectionId)
            .then((res) => res.json())
            .then((data) => {
                setCourse(data[0].course)
                setLetter(data[0].letter)
            })
    }, [sectionId])

    return (
        <>
            <Header />
            <div className="main">
                <h1>SECTION {course ? course : 'Loading..'} {letter}</h1>
                {components[userType]}
            </div>
        </>
    )
}

export default Section