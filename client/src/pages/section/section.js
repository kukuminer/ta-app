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
    const { course, letter } = useParams()
    const userId = getUser()

    const [userType, setUserType] = React.useState(null);

    React.useEffect(() => {
        fetch('/api/user/' + userId)
            .then((res) => res.json())
            .then((data) => {
                setUserType(data.userType)
            })
    }, [userId])

    return (
        <>
            <Header />
            <div className="main">
                <h1>SECTION {course} {letter}</h1>
                {components[userType]}
            </div>
        </>
    )
}

export default Section