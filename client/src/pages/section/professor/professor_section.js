import React from "react"
import axios from "axios"
import { useParams } from 'react-router-dom'
// import Assignment from "../../components/assignment_row"
import { DataGrid } from '@mui/x-data-grid'

const GET_URL = '/api/instructor/'

const columns = [
    { field: 'firstname', headerName: 'Name', width: 200 },
    { field: 'lastname', headerName: 'Surname', width: 200 },
    { field: 'interest', headerName: 'Interest', width: 150 },
    { field: 'qualification', headerName: 'Qualification', width: 150 },
    { field: 'pref', headerName: 'Preference', width: 150 },
    { field: 'note', headerName: 'Note', width: 300, editable: true },
]

const loadingRows = [
    { id: 1, firstname: 'Loading...' },
];
const ProfessorSection = () => {
    const { sectionId } = useParams()
    const [tableData, setTableData] = React.useState(null)

    React.useEffect(() => {
        const url = GET_URL + sectionId
        axios.get(url)
            .then((res) => {
                res.data.forEach((element, idx) => {
                    element.id = idx
                    return element
                });
                console.log(res.data)
                setTableData(res.data)
            })
    }, [sectionId])

    return (
        <>
            <h2>Applicants:</h2>
            <DataGrid
                loading={!tableData}
                rows={tableData ?? loadingRows}
                columns={columns}
                density="comfortable"
                disableRowSelectionOnClick
                hideFooter
                // onCellClick={(p, e, d) => console.log(p, e, d)}
            />

            {/* <table className='section-application-table'>
                <tbody>
                    <tr>
                        <th>Student</th>
                        {/* <th>Grade</th> }
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
            </table> */}

        </>
    )
}

export default ProfessorSection