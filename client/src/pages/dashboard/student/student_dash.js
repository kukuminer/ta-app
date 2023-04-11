import React from "react";
import axios from "axios";
import getUser from "../../../getUser";
import { Link } from "react-router-dom";

const StudentDash = () => {
    const id = getUser()

    const [pastTable, setPastTable] = React.useState(null)
    const [availTable, setAvailTable] = React.useState(null)

    React.useEffect(() => {
        const request = {
            method: 'get',
            url: '/api/student/applications/' + id
        }
        axios(request)
            .then((res) => {
                setPastTable(res.data)
            })
    }, [id])

    React.useEffect(() => {
        const url = '/api/student/applications/available/' + id
        axios.get(url)
            .then((res) => {
                setAvailTable(res.data)
            })
    }, [id])



    return (
        <>
            <h1>
                This is the student dashboard
            </h1>
            <p>
                Current TA applications:
            </p>
            <table className="student-table">
                <tbody>
                    <tr>
                        <th>Term</th>
                        <th>Link</th>
                    </tr>
                    {
                        !availTable ? <tr><td>loading...</td></tr> : availTable.map((val, key) => {
                            return (
                                <tr key={key}>
                                    <td>{val.term}</td>
                                    <td>
                                        <Link state={{courses: availTable}} to={'/application/' + val.term}>View</Link>
                                    </td>
                                </tr>
                            )
                        })
                    }
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
                        !pastTable ? <tr><td>loading...</td></tr> : pastTable.map((val, key) => {
                            return (
                                <tr key={key}>
                                    <td>{val.term}</td>
                                    <td>{val.availability}</td>
                                    <td>{val.incanada ? 'Yes' : 'No'}</td>
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