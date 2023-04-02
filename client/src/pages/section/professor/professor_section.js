import getUser from "../../../getUser"
import React from "react"
import axios from "axios"
import { useParams } from 'react-router-dom'

const ProfessorSection = () => {
    const id = getUser()
    const { course, letter } = useParams()

    const [tableData, setTableData] = React.useState(null)
    const [pref, setPref] = React.useState(null)
    const [note, setNote] = React.useState(null)
    const [changesMade, setChangesMade] = React.useState(false)


    React.useEffect(() => {
        const request = {
            method: 'get',
            url: '/api/professor/' + course + '/' + letter + '/' + id
        }
        axios(request)
            .then((res) => {
                setTableData(res.data)
                setPref(res.data.pref)
                setNote(res.data.note)
            })
    }, [course, letter, id, changesMade])


    React.useEffect(() => {
        if(tableData)
        {
            if(pref) setChangesMade(!(pref === tableData.pref))
            if(note) setChangesMade(!(note === tableData.note))
        }
    }, [pref, note, tableData])

    const updateAssignment = () => {
        console.log('updating!')

        setChangesMade(false)
    }

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
                                <tr key={key}>
                                    <td>{val.firstname} {val.lastname}</td>
                                    <td>{val.grade}</td>
                                    <td>{val.interest}</td>
                                    <td>{val.qualification}</td>
                                    <td><input type={"number"} value={pref ? pref : 0} onChange={(event) => setPref(event.target.value)}/></td>
                                    <td>{val.note}</td>
                                    <td><button onClick={updateAssignment} disabled={!changesMade}>Update</button></td>
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