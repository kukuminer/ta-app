import React from "react"
import axios from "axios"
import { useParams } from 'react-router-dom'
import Assignment from "../../components/assignment_row"

const GET_URL = '/api/instructor/'

const ProfessorSection = () => {
    const { sectionId } = useParams()
    const [tableData, setTableData] = React.useState(null)

    React.useEffect(() => {
        const url = GET_URL + sectionId
        axios.get(url)
            .then((res) => {
                setTableData(res.data)
            })
    }, [sectionId])

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