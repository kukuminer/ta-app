import { useState, useEffect } from "react"
import axios from "axios"
import { useParams } from 'react-router-dom'
// import Assignment from "../../components/assignment_row"
// import { DataGrid } from '@mui/x-data-grid'
import { GridColDef, GridComparatorFn } from "@mui/x-data-grid"
import ProfSectionTable from "./datagrid/section_table"
import renderGridCellSelectInput from "./datagrid/render_select_input"
import renderGridCellTextFieldInput from "./datagrid/render_textfield_input"

const GET_URL = '/api/instructor/'
const POST_URL = '/api/instructor/assignment'

const orderedList = ['No preference', 'Acceptable', 'Requested', 'Critical']
// const sortOrder: GridComparatorFn = (v1, v2, c1, c2) => {

// }

const columns: GridColDef[] = [
    { field: 'firstname', headerName: 'Name', width: 150, headerClassName: 'section-table-header' },
    { field: 'lastname', headerName: 'Surname', width: 150, headerClassName: 'section-table-header' },
    { field: 'interest', headerName: 'Interest', width: 150, headerClassName: 'section-table-header' },
    { field: 'qualification', headerName: 'Qualification', width: 150, headerClassName: 'section-table-header' },
    {
        field: 'pref',
        headerName: 'Preference',
        width: 180,
        editable: true,
        renderEditCell: renderGridCellSelectInput,
        renderCell: renderGridCellSelectInput,
        // type: 'singleSelect',
        // valueOptions: [
        //     { value: 0, label: 'No preference' },
        //     { value: 50, label: 'Acceptable' },
        //     { value: 75, label: 'Requested' },
        //     { value: 100, label: 'Critical' },
        // ],
        align: 'left',
        headerAlign: 'left',
        headerClassName: 'section-table-header',

    },
    {
        field: 'note',
        headerName: 'Note',
        width: 300,
        editable: true,
        renderEditCell: renderGridCellTextFieldInput,
        renderCell: renderGridCellTextFieldInput,
        headerClassName: 'section-table-header'
    },
]

const loadingRows = [
    { userid: -1, firstname: 'Loading...' },
]

const ProfessorSection = () => {
    const { sectionId } = useParams()
    const [tableData, setTableData] = useState(null)
    // const [rowSelectionModel, setRowSelectionModel] = useState([])

    useEffect(() => {
        const url = GET_URL + sectionId
        axios.get(url)
            .then((res) => {
                res.data.forEach((element, idx) => {
                    element.pref = element.pref ?? 'no preference'
                    return element
                });
                console.log(res.data)
                setTableData(res.data)
            })
    }, [sectionId])

    function onEditStop(params, event, details) {
        console.log(params)
        console.log(event)
        console.log(details)
        if (!params) return
        if (!params.row) return
        const body = {
            pref: params.row.pref,
            note: params.row.note,
            studentNum: params.row.id,
            sectionId: sectionId,
        }
        body[params.field] = params.value
        console.log(body)
        axios.post(POST_URL, body)
            .then((res) => {
                console.log(res)
            })
    }

    return (
        <>
            <div className="section">
                <h2>Applicants:</h2>
                <ProfSectionTable
                    idVarName={'userid'}
                    rows={tableData ?? loadingRows}
                    columns={columns}
                    loading={!tableData}
                    onEditStop={onEditStop}
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