import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import axios from "axios"
import { useEffect, useState, useMemo } from "react"
import Papa from 'papaparse'
import CustomTablerow from "../../../components/color_table_row"
import { LIGHT_GRAY } from "../../../../color"

const GET_URL = "/api/admin/tables"
const GET_DATA_URL = "/api/admin/table/export/" //+tablename


const ExportTab = () => {
    const [selectedTable, setSelected] = useState(null)
    const [tables, setTables] = useState(null)
    // const [tableData, setTableData] = useState(null)
    const [csv, setCSV] = useState(null)

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

    async function handleChange(event) {
        const newValue = tables ? event.target.value : ''
        setSelected(newValue)
        if (newValue) {
            const res = await axios.get(GET_DATA_URL + newValue)
            const csv = Papa.unparse(res.data)
            setCSV({ tablename: newValue, data: csv })
        }
    }

    const downloadLink = useMemo(() => {
        if (!csv) return null
        const data = new Blob([csv.data], { type: 'text/csv;charset=utf-8;' })
        const url = window.URL.createObjectURL(data)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', csv.tablename + '.csv')
        return link
    }, [csv])

    const tableData = useMemo(() => {
        if (!csv) return null
        const res = Papa.parse(csv.data)
        return res.data
    }, [csv])

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
            onClick={() => downloadLink.click()}
            disabled={!downloadLink}
        >
            Download
        </Button>
        <div className="admin-table">
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        {
                            tableData?.slice(0, 1).map((cols, i) =>
                                <CustomTablerow key={i} color={LIGHT_GRAY}>
                                    {cols.map((val, j) =>
                                        <TableCell key={j}>{val}</TableCell>
                                    )}
                                </CustomTablerow>
                            )}
                    </TableHead>
                    <TableBody>
                        {
                            tableData?.slice(1).map((cols, i) =>
                                <TableRow key={i}>
                                    {cols.map((val, j) =>
                                        <TableCell key={j}>{val}</TableCell>
                                    )}
                                </TableRow>
                            )
                            ??
                            <TableRow><TableCell>Please select a table</TableCell></TableRow>
                        }
                    </TableBody>
                    {/* {tableData ? tableData.head :
                        <TableHead>
                            <TableRow>
                                <TableCell>Please select a table</TableCell>
                            </TableRow>
                        </TableHead>
                    } */}
                </Table>

            </TableContainer>
        </div>
    </>
}

export default ExportTab