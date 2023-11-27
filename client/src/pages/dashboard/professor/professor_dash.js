import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { GridColDef } from "@mui/x-data-grid"
import DatagridTable from "../../components/datagrid/datagrid_table"

const GET_URL = '/api/instructor/courses'

const columns: GridColDef = [
    { field: 'term', headerName: 'Term', width: 100, headerClassName: 'section-table-header' },
    { field: 'course', headerName: 'Course', width: 150, headerClassName: 'section-table-header', flex: 1 },
    { field: 'letter', headerName: 'Section', width: 100, headerClassName: 'section-table-header' },
    {
        field: 'id',
        headerName: 'Link',
        width: 100,
        headerClassName: 'section-table-header',
        renderCell: (p) => {
            return <Link to={'/section/' + p.id}>View</Link>
        }
    }
]

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
            <h1>Instructor Dashboard</h1>
            <p>Your class sections this term:</p>
            <div className='instructor-table'>
                <DatagridTable
                    columns={columns}
                    idVarName={'id'}
                    loading={!tableData}
                    onEditStop={null}
                    processRowUpdate={null}
                    rows={tableData ?? []}
                    rowHeight={60}
                />
            </div>
            {/* <table className='prof-table'>
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
                                        <Link to={'/section/' + val.id}>View</Link>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table> */}
        </>
    )
}

export default ProfessorDash;