import React from "react";
import axios from "axios";
import getUser from "../../../getUser";
import { Link } from "react-router-dom";

const StudentDash = () => {
    const id = getUser()

    const [tableData, setTableData] = React.useState(null)

    React.useEffect(() => {
        const request = {
            method: 'get',
            url: '/api/student/applications/' + id
        }
        axios(request)
            .then((res) => {
                setTableData(res.data)
                console.log(tableData)
            })
    }, [id])



    return (
        <>
            <h1>
                This is the student dashboard
            </h1>
            <p>
                Available TA applications:
            </p>
            <table className="student-table">
                <tbody>
                    <tr>
                        <th>Term</th>
                        <th>Link</th>
                    </tr>
                    <tr>
                        {

                        }
                    </tr>
                </tbody>
            </table>
            <p>
                Previous TA applications:
            </p>
            <table className="student-table">
                <tbody>
                    <tr>
                        <th>Term</th>
                        <th>Availability</th>
                        <th>On Site?</th>
                        <th>Link</th>
                    </tr>
                    {
                        !tableData ? <tr><td>loading...</td></tr> : tableData.map((val, key) => {
                            return (
                                <tr key={key}>
                                    <td>{val.term}</td>
                                    <td>{val.availability}</td>
                                    <td>{val.incanada?'Yes':'No'}</td>
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