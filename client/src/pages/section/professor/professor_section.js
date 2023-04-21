import getUser from "../../../getUser"
import React from "react"
import axios from "axios"
import { useParams } from 'react-router-dom'
import Assignment from "../../components/assignment_row"

const ProfessorSection = () => {
    const id = getUser()
    const { sectionId } = useParams()
    const [tableData, setTableData] = React.useState(null)

    React.useEffect(() => {
        const url = '/api/professor/' + sectionId + '/' + id
        axios.get(url)
            .then((res) => {
                setTableData(res.data)
            })
    }, [sectionId, id])

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
                        <th>Preference</th>
                        <th>Note</th>
                        <th></th>
                    </tr>
                    {
                        !tableData ? <tr><td>loading...</td></tr> : tableData.map((val, key) => {
                            return (
                                <Assignment data={val} rowKey={key} key={key} />
                            )
                        })
                    }
                </tbody>
            </table>

        </>
    )
}

export default ProfessorSection