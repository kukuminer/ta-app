import { Paper, Table, TableBody, TableCell, TableContainer, TableRow, Button, Checkbox, TableHead } from '@mui/material'
import React from 'react'
import axios from 'axios'
import Papa from 'papaparse'

/**
 * 
 * @param {Object} props 
 * props should contain:
 * - postBody {Object}
 * - postURL {String}
 * - postConditions {Array[bool]}
 * @returns 
 */
const CSVTable = (props) => {

    const [uploadedData, setUploadedData] = React.useState(null)
    const [postableData, setPostableData] = React.useState(null)
    const [lastPostStatus, setLastPostStatus] = React.useState(null)
    const [hasHeader, setHasHeader] = React.useState(false)
    const [meetsPostConditions, setMeetsPostConditions] = React.useState(true)

    const postFile = () => {
        setLastPostStatus(null)
        const body = props.postBody
        body.rows = hasHeader ? postableData.slice(1) : postableData
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
        // console.log(file)
        formatData(file)
    }


    const formatData = (file) => {
        if (file) {
            Papa.parse(file, {
                skipEmptyLines: true,
                complete: function (results) {
                    console.log("Finished:", results.data);
                    setPostableData(results.data)
                    var newData = []
                    for (const [idx, row] of Object.entries(results.data)) {
                        var newRow = []
                        for (const [j, item] of Object.entries(row)) {
                            newRow.push(<TableCell key={j}>{item}</TableCell>)
                        }
                        newData.push(<TableRow key={idx}>{newRow}</TableRow>)
                    }
                    setUploadedData(newData)
                }
            })
        }
    }

    const handleCheck = (e) => {
        setHasHeader(!hasHeader)
        // uploadedData[0].props.sx = {background: '#DDDDDD'}
        // console.log(uploadedData[0].props.sx)
        // TODO: Add dynamic colour changing 
    }

    /**
     * Check passed in posting conditions
     * This is a way for the parent to control whether or not
     * the file can be posted based on other conditions of the parent
     */
    React.useEffect(() => {
        if (props.postConditions) {
            for (const item of props.postConditions) {
                if (!item) {
                    setMeetsPostConditions(false)
                    return
                }
            }
            setMeetsPostConditions(true)
        }
    }, [props.postConditions])

    const headers = React.useMemo(() => {
        if (props.colHeaders) {
            var headerRow = []
            for (const [i, item] of Object.entries(props.colHeaders)) {
                headerRow.push(<TableCell key={i}>{item}</TableCell>)
            }
            console.log(headerRow)
            return <TableHead sx={{background: '#eeeeee'}}>
                <TableRow key={'header-row'}>{headerRow}</TableRow>
            </TableHead>
        }
        return null
    }, [props])

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
                    disabled={!(postableData && uploadedData && meetsPostConditions)}
                >
                    POST to DB
                </Button>
                <p>
                    {lastPostStatus}
                </p>
            </div>
            <div className='has-header-check'>
                Ignore first row?
                <Checkbox
                    id={"has-header-checkbox"}
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
                        {headers}
                        <TableBody>
                            {uploadedData ?? <TableRow><TableCell>Please upload a file</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    )
}

export default CSVTable