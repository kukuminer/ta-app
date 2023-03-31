import React from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import './professor_dash.css'

const ProfessorDash = () => {
    const id = localStorage.getItem('userId')

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

    console.log(tableData)
    return (
        <>
            <h1>THIS IS THE PROFESSOR DASH</h1>
            <p>Your class sections this term:</p>
            <table className='prof-table'>
                <tbody>
                    <tr>
                        <th>Course</th>
                        <th>Section</th>
                    </tr>
                    {
                        !tableData ? <tr><td>loading...</td></tr> : tableData.map((val, key) => {
                            return (
                                <tr key={key}>
                                    <td>{val.course}</td>
                                    <td>{val.letter}</td>
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