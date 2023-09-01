import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const GET_URL = '/api/instructor/courses'

const ProfessorDash = () => {
    const [tableData, setTableData] = React.useState(null)

    React.useEffect(() => {
        axios.get(GET_URL)
            .then((res) => {
                setTableData(res.data)
            })
    }, [])

    return (
        <>
            <h1>THIS IS THE PROFESSOR DASH</h1>
            <p>Your class sections this term:</p>
            <table className='prof-table'>
                <tbody>
                    <tr>
                        <th>Term</th>
                        <th>Course</th>
                        <th>Section</th>
                        <th>Link</th>
                    </tr>
                    {
                        !tableData ? <tr><td>loading...</td></tr> : tableData.map((val, key) => {
                            return (
                                <tr key={key}>
                                    <td>{val.term}</td>
                                    <td>{val.course}</td>
                                    <td>{val.letter}</td>
                                    <td>
                                        <Link to={'/section/'+val.id}>View</Link>
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

export default ProfessorDash;