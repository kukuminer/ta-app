import React from "react"
import Header from "../header/header"
import StudentApplication from "./student/student_application"
import getUser from "../../getUser"
import "./application.css"

const components = {
    'student': <StudentApplication />,
    'professor': null,
    'admin': null,
}

const Application = () => {
    const userId = getUser()

    const [userType, setUserType] = React.useState(null);

    React.useEffect(() => {
        fetch('/api/usertype/' + userId)
            .then((res) => res.json())
            .then((data) => {
                setUserType(data.userType)
            })
    }, [userId])


    return (
        <>
            <Header />
            <div className="application-page">
                <div className="main">
                    <h1>This is the application page</h1>
                    {components[userType]}
                </div>
            </div>
        </>
    )
}

export default Application