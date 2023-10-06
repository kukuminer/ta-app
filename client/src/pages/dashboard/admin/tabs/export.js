import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"

const GET_URL = "/api/admin/tables"


const ExportTab = () => {
    const [selectedTable, setSelected] = useState(null)
    const [tables, setTables] = useState(null)

    useEffect(() => {
        load()
        async function load() {
            const res = await axios.get(GET_URL)
            var tableList = []
            for (var i in res.data) {
                const name = res.data[i].tablename
                tableList.push(<MenuItem id={name} value={name} key={name}>{name}</MenuItem>)
            }
            setTables(tableList)
        }
    }, [])

    function handleChange(event) {
        setSelected(tables ? event.target.value : '')
    }

    return <>
        <FormControl
            id={"table-select-form"}
            fullWidth
            error={!selectedTable}
            sx={{ width: '80vw' }}
        >
            <InputLabel id="table-name">Table</InputLabel>
            <Select
                labelId="table-name"
                id="table-select"
                value={selectedTable ?? ''}
                label="Table"
                onChange={handleChange}
            >
                {tables ?? <MenuItem>Loading..</MenuItem>}
            </Select>
            <FormHelperText>{!selectedTable ? 'Please select a table' : ''}</FormHelperText>
        </FormControl>
        <br />
        <Button
            variant="contained"
            component="label"
            onClick={console.log("hello")}
            disabled={!selectedTable}
        >
            Download
        </Button>
        <div className="admin-table">
            <TableContainer component={Paper}>
                <Table size="small">
                    {/* {headers} */}
                    <TableBody>
                        <TableRow><TableCell>Please select a table</TableCell></TableRow>
                    </TableBody>
                </Table>

            </TableContainer>
        </div>
    </>
}

export default ExportTab