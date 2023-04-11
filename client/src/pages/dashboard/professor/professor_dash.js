import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import getUser from '../../../getUser'

const ProfessorDash = () => {
    const id = getUser()

    const [tableData, setTableData] = React.useState(null)

    React.useEffect(() => {
        const request = {
            method: 'get',
            url: '/api/professor/courses/' + id
        }
        axios(request)
            .then((res) => {
                setTableData(res.data)
            })
    }, [id])

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