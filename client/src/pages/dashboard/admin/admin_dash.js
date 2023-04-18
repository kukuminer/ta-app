import React from "react"
import axios from "axios"
import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

const URL = "/api/admin/tables"
const AdminDash = () => {

    const [tables, setTables] = React.useState(null)
    const [selectedTable, setSelected] = React.useState('')
    const [uploadedData, setUploadedData] = React.useState(null)

    React.useEffect(() => {
        axios.get(URL)
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
                var newData = []
                for (const [idx, row] of Object.entries(split)) {
                    if (row) {
                        var newRow = []
                        const vals = row.trim().split(',')
                        for(const [j,item] of Object.entries(vals)) {
                            newRow.push(<TableCell key={j}>{item}</TableCell>)
                        }
                        console.log(newRow)
                        newData.push(<TableRow key={idx}>{newRow}</TableRow>)
                    }
                }
                setUploadedData(newData)
            }
            reader.readAsText(file)
        }
    }

    return (
        <>
            <h1>ADMIN DASHBOARD</h1>
            <FormControl fullWidth error={!selectedTable}>
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

            <Button variant="contained" component="label">
                Upload CSV
                <input hidden
                    accept=".csv"
                    type="file"
                    onChange={(event) => handleFile(event)}
                />
            </Button>

            <TableContainer>
                <Table aria-label="data-table">
                    <TableHead>
                    </TableHead>
                    <TableBody>
                        {uploadedData}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default AdminDash