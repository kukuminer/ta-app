import getUser from "../../../getUser"
import React from "react"
import axios from "axios"
import { useParams } from 'react-router-dom'

const ProfessorSection = () => {
    const id = getUser()
    const { course, letter } = useParams()

    const [tableData, setTableData] = React.useState(null)

    React.useEffect(() => {
        const request = {
            method: 'get',
            url: '/api/professor/' + course + '/' + letter + '/' + id
        }
        axios(request)
            .then((res) => {
                setTableData(res.data)
            })
    }, [course, letter, id])


    return (
        <>
            <h2>Applicants:</h2>
            <table className='section-application-table'>
                <tbody>
                    <tr>
                        <th>Student</th>
                        <th>Grade</th>
                        <th>Interest</th>
                        <th>Qualification</th>
                    </tr>
                    {
                        !tableData ? <tr><td>loading...</td></tr> : tableData.map((val, key) => {
                            return (
                                <tr key={key}>
                                    <td>{val.student}</td>
                                    <td>{val.grade}</td>
                                    <td>{val.interest}</td>
                                    <td>{val.qualification}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>

        </>
    )
}

export default ProfessorSection