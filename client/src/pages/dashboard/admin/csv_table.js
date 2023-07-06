import { Paper, Table, TableBody, TableCell, TableContainer, TableRow, Button } from '@mui/material'
import React from 'react'
import axios from 'axios'

const CSVTable = (props) => {

    const [uploadedData, setUploadedData] = React.useState(null)
    const [postableData, setPostableData] = React.useState(null)
    const [lastPostStatus, setLastPostStatus] = React.useState(null)

    const postFile = () => {
        const body = props.postBody
        body.rows = postableData
        console.log(body)
        axios.post(props.postURL, body)
            .then((res) => {
                setLastPostStatus(res.status + ' OK')
            })
            .catch((error) => {
                setLastPostStatus('Error, see console log')
                console.log('error posting:', error)
            })

    }

    const handleFile = (event) => {
        const file = event.target.files[0]
        console.log(file)
        formatData(file)
    }


    const formatData = (file) => {
        console.log(file)
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const raw = e.target.result
                const split = raw.split('\n')
                for (var item of split) {
                    item = item.trim()
                }
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

    return (
        <>
            <div className="admin-buttons">
                <Button variant="contained" component="label">
                    Upload CSV
                    <input hidden
                        accept=".csv"
                        type="file"
                        onClick={(event) => event.target.value = null}
                        onChange={(event) => handleFile(event)}
                    />
                </Button>
                <Button
                    variant="contained"
                    component="label"
                    onClick={postFile}
                    sx={{ margin: '0 1em' }}
                    color="secondary"
                    disabled={!(postableData && uploadedData)}
                >
                    POST to DB
                </Button>
                <p>
                    {lastPostStatus}
                </p>
            </div>

            <div className="admin-table">
                <TableContainer component={Paper}>
                    <Table size="small" aria-label="data-table">
                        {/* <TableHead >
                            <TableRow sx={{ backgroundColor: '#dddddd' }}>
                                {keyCells ? keyCells.slice(1) : <TableCell>Please select a table</TableCell>}
                            </TableRow>
                        </TableHead> */}
                        <TableBody>
                            {uploadedData ? uploadedData : <TableRow><TableCell>Please upload a file</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    )
}

export default CSVTable