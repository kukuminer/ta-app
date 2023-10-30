import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { useParams } from 'react-router-dom'
// import Assignment from "../../components/assignment_row"
// import { DataGrid } from '@mui/x-data-grid'
import { GridColDef, GridComparatorFn, GridRowEditStopReasons } from "@mui/x-data-grid"
import ProfSectionTable from "./datagrid/section_table"
import renderGridCellSelectInput from "./datagrid/render_select_input"
import renderGridCellTextFieldInput from "./datagrid/render_textfield_input"
import renderGridCellTooltip from "./datagrid/render_tooltip"

const GET_URL = '/api/instructor/'
const POST_URL = '/api/instructor/assignment'
const ORDERED_LIST = ['no preference', 'acceptable', 'requested', 'critical']

const sortOrder: GridComparatorFn = (v1, v2) => {
    return ORDERED_LIST.indexOf(v1) - ORDERED_LIST.indexOf(v2)
}

const columns: GridColDef[] = [
    { field: 'firstname', headerName: 'Name', width: 150, headerClassName: 'section-table-header' },
    { field: 'lastname', headerName: 'Surname', width: 150, headerClassName: 'section-table-header' },
    {
        field: 'details',
        headerName: 'Details',
        width: 100,
        renderCell: renderGridCellTooltip,
        headerClassName: 'section-table-header',
        sortable: false,
    },
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
        sortComparator: sortOrder,
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

// const loadingRows = [
//     { userid: -1, firstname: 'Loading...' },
// ]

const ProfessorSection = () => {
    const { sectionId } = useParams()
    const [tableData, setTableData] = useState(null)
    // const [rowSelectionModel, setRowSelectionModel] = useState([])

    useEffect(() => {
        const url = GET_URL + sectionId
        axios.get(url)
            .then((res) => {
                console.log(res.data)
                var dataObj = {}
                res.data.forEach((element, idx) => {
                    element.pref = element.pref ?? 'no preference'
                    element.note = element.note ?? ''
                    if (!dataObj[element.pool]) dataObj[element.pool] = []
                    dataObj[element.pool].push(element)
                    return element
                });
                setTableData(dataObj)
            })
    }, [sectionId])

    const onEditStop = useCallback((params, event, details) => {
        if (params.reason === GridRowEditStopReasons.enterKeyDown) {
            event.defaultMuiPrevented = true;
            return
        }
    }, [])

    const processRowUpdate = useCallback(async (newRow, oldRow) => {
        console.log(newRow, oldRow)
        if (JSON.stringify(oldRow) === JSON.stringify(newRow)) return newRow
        const body = {
            pref: newRow.pref,
            note: newRow.note,
            studentNum: newRow.userid,
            sectionId: sectionId,
        }
        const res = await axios.post(POST_URL, body)
        console.log(res)
        return newRow

    }, [sectionId])

    return (
        <>
            <div className="section">
                {tableData &&
                    Object.keys(tableData).map((key, idx) =>
                        <div key={key}>
                            <h2>{key.toUpperCase()} Applicants</h2>
                            <ProfSectionTable
                                key={key}
                                idVarName={'userid'}
                                rows={tableData[key]}
                                columns={columns}
                                loading={!tableData}
                                onEditStop={onEditStop}
                                processRowUpdate={processRowUpdate}
                            />
                        </div>
                    )
                }
                {/* <h2>Unit 1 Applicants:</h2>
                <ProfSectionTable
                    idVarName={'userid'}
                    rows={tableData ?? loadingRows}
                    columns={columns}
                    loading={!tableData}
                    onEditStop={onEditStop}
                    processRowUpdate={processRowUpdate}
                /> */}
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