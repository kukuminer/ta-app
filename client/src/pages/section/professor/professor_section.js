import React from "react"
import { useState } from "react"
import axios from "axios"
import { useParams } from 'react-router-dom'
// import Assignment from "../../components/assignment_row"
// import { DataGrid } from '@mui/x-data-grid'
import ProfSectionTable from "./section_table"

const GET_URL = '/api/instructor/'

const columns: GridColDef[] = [
    { field: 'firstname', headerName: 'Name', width: 150 },
    { field: 'lastname', headerName: 'Surname', width: 150 },
    { field: 'interest', headerName: 'Interest', width: 150 },
    { field: 'qualification', headerName: 'Qualification', width: 150 },
    {
        field: 'pref',
        headerName: 'Preference',
        width: 150,
        editable: true,
        type: 'number',
        align: 'left',
        headerAlign: 'left',
    },
    { field: 'note', headerName: 'Note', width: 300, editable: true },
]

const loadingRows = [
    { id: 0, firstname: 'Loading...' },
]

const ProfessorSection = () => {
    const { sectionId } = useParams()
    const [tableData, setTableData] = useState(null)
    // const [rowSelectionModel, setRowSelectionModel] = useState([])

    React.useEffect(() => {
        const url = GET_URL + sectionId
        axios.get(url)
            .then((res) => {
                res.data.forEach((element, idx) => {
                    element.id = idx
                    element.pref = element.pref ?? 0
                    return element
                });
                console.log(res.data)
                setTableData(res.data)
            })
    }, [sectionId])

    return (
        <>
            <div className="section">
                <h2>Applicants:</h2>
                <ProfSectionTable
                    rows={tableData ?? loadingRows}
                    columns={columns}
                    loading={!tableData}
                />
                {/* <DataGrid
                    loading={!tableData}
                    rows={tableData ?? loadingRows}
                    columns={columns}
                    getRowId={(row) => row.id}
                    density="comfortable"
                    disableRowSelectionOnClick
                    hideFooter
                    editMode="cell"
                    processRowUpdate={(updated, original) => true}
                    // onProcessRowUpdateError={(e) => console.log(e)}
                    // rowSelectionModel={rowSelectionModel}
                    // onRowSelectionModelChange={(newModel, details) => setRowSelectionModel(newModel)}

                // onCellClick={(p, e, d) => console.log(p, e, d)}
                /> */}
            </div>

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