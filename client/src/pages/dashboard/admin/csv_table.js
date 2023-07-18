import { Paper, Table, TableBody, TableCell, TableContainer, TableRow, Button, Checkbox } from '@mui/material'
import React from 'react'
import axios from 'axios'
import Papa from 'papaparse'

const CSVTable = (props) => {

    const [uploadedData, setUploadedData] = React.useState(null)
    const [postableData, setPostableData] = React.useState(null)
    const [lastPostStatus, setLastPostStatus] = React.useState(null)
    const [hasHeader, setHasHeader] = React.useState(true)

    const postFile = () => {
        const body = props.postBody
        body.rows = hasHeader ? postableData.slice(1) : postableData
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
                console.log(raw)
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

    const handleCheck = (e) => {
        setHasHeader(!hasHeader)
        // uploadedData[0].props.sx = {background: '#DDDDDD'}
        // console.log(uploadedData[0].props.sx)
        // TODO: Add dynamic colour changing 
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
            <div className='has-header-check'>
                Has header?
                <Checkbox
                    checked={hasHeader}
                    onClick={handleCheck}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
                <p>
                    Please ensure the csv is comma separated
                </p>
            </div>
            <div className="admin-table">
                <TableContainer component={Paper}>
                    <Table size="small" aria-label="data-table">
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