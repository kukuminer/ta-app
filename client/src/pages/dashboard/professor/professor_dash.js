import axios from 'axios'
import './professor_dash.css'

const ProfessorDash = () => {
    const id = localStorage.getItem('userId')
    const request = {
        method: 'get',
        url: '/api/professor/courses/' + id,
    }
    axios(request)
        .then((response) => {
            console.log(response.data)
        })
        .catch((error) => {
            console.log('error retrieving professor courses: ', error)
            return error
        })

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
                </tbody>
            </table>
        </>
    )
}

export default ProfessorDash;