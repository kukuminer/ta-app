import React from "react"
import axios from "axios"
import { Button, Checkbox, FormControl, FormControlLabel, FormHelperText, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import getUser from "../../../getUser"

const GET_URL = "/api/admin/tables"
const GET_KEYS_URL = "/api/admin/table/" //+tablename
const POST_URL = "/api/admin/upsert"

const AdminDash = () => {

    const [tables, setTables] = React.useState(null)
    const [selectedTable, setSelected] = React.useState('')
    const [uploadedData, setUploadedData] = React.useState(null)
    const [postableData, setPostableData] = React.useState(null)

    React.useEffect(() => {
        axios.get(GET_URL)
            .then((res) => {
                var tableList = []
                for (var i in res.data) {
                    const name = res.data[i].tablename
                    tableList.push(<MenuItem value={name} key={name}>{name}</MenuItem>)
                }
                setTables(tableList)
            })
    }, [])

    React.useEffect(() => {
        if (tables) setSelected(tables[0].value)
    }, [tables])

    const handleFile = (event) => {
        const file = event.target.files[0]
        console.log(file)

        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const raw = e.target.result
                const split = raw.split('\n')
                setPostableData(split)
                var newData = []
                for (const [idx, row] of Object.entries(split)) {
                    if (row) {
                        var newRow = []
                        const vals = row.trim().split(',')
                        for (const [j, item] of Object.entries(vals)) {
                            newRow.push(<TableCell key={j}>{item}</TableCell>)
                        }
                        newData.push(<TableRow key={idx}>{newRow}</TableRow>)
                    }
                }
                setUploadedData(newData)
            }
            reader.readAsText(file)
        }
    }

    const postFile = () => {
        console.log(postableData)
        const body = {
            userId: getUser(),
            tableName: selectedTable,
            rows: postableData,
        }
        axios.post(POST_URL, body)
            .then((res) => {
                console.log(res)
            })
            .catch((error) => {
                console.log('error posting:', error)
            })
    }

    return (
        <>
            <h1>ADMIN DASHBOARD</h1>
            <FormControl
                fullWidth
                error={!selectedTable}
                sx={{ width: '80vw' }}
            >
                <InputLabel id="table-name">Table</InputLabel>
                <Select
                    labelId="table-name"
                    id="table-select"
                    value={selectedTable ? selectedTable : ''}
                    label="Table"
                    onChange={(event) => setSelected(event.target.value)}
                >
                    {tables}
                </Select>
                <FormHelperText>{!selectedTable ? 'Please select a table' : ''}</FormHelperText>
            </FormControl>

            <div className="admin-buttons">
                <Button variant="contained" component="label">
                    Upload CSV
                    <input hidden
                        accept=".csv"
                        type="file"
                        onChange={(event) => handleFile(event)}
                    />
                </Button>
                <Button
                    variant="contained"
                    component="label"
                    onClick={postFile}
                    sx={{ margin: '0 1em' }}
                    color="secondary"
                    disabled={!(postableData && selectedTable)}
                >
                    POST to DB
                </Button>
            </div>
            <div className="admin-table">
                <TableContainer component={Paper}>
                    <Table size="small" aria-label="data-table">
                        <TableHead>
                        </TableHead>
                        <TableBody>
                            {uploadedData}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    )
}

export default AdminDash