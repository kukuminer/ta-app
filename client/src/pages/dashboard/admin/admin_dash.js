import React from "react"
import axios from "axios"
import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import getUser from "../../../getUser"

const GET_URL = "/api/admin/tables"
const GET_KEYS_URL = "/api/admin/table/" //+tablename
const POST_URL = "/api/admin/upsert"

const AdminDash = () => {

    const [tables, setTables] = React.useState(null)
    const [selectedTable, setSelected] = React.useState('')
    const [uploadedData, setUploadedData] = React.useState(null)
    const [postableData, setPostableData] = React.useState(null)
    const [keyList, setKeyList] = React.useState(null)

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

    React.useEffect(() => {
        if (selectedTable) {
            const url = GET_KEYS_URL + selectedTable
            axios.get(url)
                .then((res) => {
                    const keys = res.data
                    const row = []
                    for (const [idx, key] of Object.entries(keys)) {
                        row.push(<TableCell key={idx}>{key}</TableCell>)
                    }
                    setKeyList(row)
                })
        }
    }, [selectedTable])

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
            <h4 className="admin-text">
                {selectedTable + ' table keys:'}
            </h4>
            <div className="admin-table">
                <TableContainer component={Paper}>
                    <Table size="small" aria-label="data-table">
                        <TableHead>
                            <TableRow>
                                {keyList}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <h4 className="admin-text">
                Please input all keys that must be unique, separated by commas (eg. <span className="admin-code">course,letter,term</span> in the 'section' table)
                <br/>
                    These keys will be used for upsert conflict resolution
            </h4>
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
                        <TableHead >
                            <TableRow sx={{ backgroundColor: '#dddddd' }}>
                                {keyList.slice(1)}
                            </TableRow>
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