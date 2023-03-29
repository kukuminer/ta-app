import React from "react";
import ProfessorDash from "./professor_dash";
import StudentDash from "./student_dash";

const components = {
    'professor': <ProfessorDash/>,
    'student': <StudentDash/>,
}

const Dashboard = () => {
    // var user

    const userId = localStorage.getItem('userId')
    const [userType, setUserType] = React.useState(null);

    React.useEffect(() => {
        fetch('/api/user/' + userId)
        .then((res) => res.json())
        .then((data) => {
            setUserType(data.userType)
            console.log(data)
        })
    }, [userId])
    
    return (
        <>
            <h1>
                DASHBOARD
            </h1>
            <h2>
                userId: {userId} 
                <br/>
                userType: {userType ? userType : 'loading..'}
                <br/>
            </h2>
            {components[userType]}
        </>
    );
};

export default Dashboard;