import React from "react";
import axios from "axios";
import getUser from "../../../getUser";
import { Link } from "react-router-dom";

const StudentDash = () => {
    const id = getUser()

    const [pastTable, setPastTable] = React.useState(null)

    React.useEffect(() => {
        const url = '/api/student/applications/available/' + id
        axios.get(url)
            .then((res) => {
                console.log(res.data)
                setPastTable(res.data)
                // Availability in submitted apps must be NOT NULL
                // Therefore, if it is null, it is not submitted yet
            })
    }, [id])



    return (
        <>
            <h1>
                This is the student dashboard
            </h1>
            <p>
                TA applications:
            </p>
            <table className="student-table">
                <tbody>
                    <tr>
                        <th>Term</th>
                        <th>Availability</th>
                        <th>On Site?</th>
                        <th>Application Status</th>
                        <th>Link</th>
                    </tr>
                    {
                        !pastTable ? <tr><td>loading...</td></tr> : pastTable.map((val, key) => {
                            return (
                                <tr key={key}>
                                    <td>{val.term}</td>
                                    <td>{val.availability}</td>
                                    <td>{val.incanada ? 'Yes' : val.incanada === false ? 'No' : ''}</td>
                                    <td>{val.availability ? 'Submitted' : 'Available'}</td>
                                    <td>
                                        <Link to={'/application/' + val.term}>View</Link>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </>
    )
}

export default StudentDash;