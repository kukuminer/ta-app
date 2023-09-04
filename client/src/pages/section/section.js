import React from "react"
import { useParams } from 'react-router-dom'
import Header from "../header/header"
import getUser from "../../getUser"
import ProfessorSection from "./professor/professor_section"
import "./section.css"

const components = {
    'student': null,
    'instructor': <ProfessorSection />,
    'admin': null,
}

const Section = () => {
    const { sectionId } = useParams()
    const userId = getUser()

    const [userType, setUserType] = React.useState(null);
    const [course, setCourse] = React.useState(null);
    const [letter, setLetter] = React.useState(null);

    React.useEffect(() => {
        fetch('/api/usertype/' + userId)
            .then((res) => res.json())
            .then((data) => {
                setUserType(data.usertype)
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
            <div className="section">
                <div className="main">
                    <h1>SECTION {course ?? 'Loading..'} {letter}</h1>
                    {components[userType]}
                </div>
            </div>
        </>
    )
}

export default Section