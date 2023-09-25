import { Paper, Table, TableBody, TableCell, TableContainer, TableRow, Button, Checkbox, TableHead } from '@mui/material'
import { styled } from '@mui/material/styles'
import React from 'react'
import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import Papa from 'papaparse'

const CustomTablerow = styled(TableRow, {
    shouldForwardProp: (prop) => prop !== 'shaded',
})(({ shaded }) => ({
    ...(shaded && {
        backgroundColor: '#eeeeee'
    })
}))

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

    const [file, setFile] = useState(null)
    const [lastPostStatus, setLastPostStatus] = useState(null)
    const [skipFirst, setSkipFirst] = useState(false)
    const [meetsPostConditions, setMeetsPostConditions] = useState(true)

    const postFile = () => {
        setLastPostStatus(null)
        const body = props.postBody
        body.rows = skipFirst ? file.slice(1) : file
        axios.post(props.postURL, body)
            .then((res) => {
                console.log(file)
                console.log(res.data)
                setLastPostStatus(res.status + ' OK')
            })
            .catch((error) => {
                setLastPostStatus('Error, see console log')
                console.log('error posting:', error)
            })
    }

    const handleFile = (event) => {
        const file = event.target.files[0]
        if (file) {
            Papa.parse(file, {
                skipEmptyLines: true,
                complete: (results) => {
                    setFile(results.data)
                }
            })
        }
    }

    /**
     * The rows displayed in the table
     */
    const tableRows = useMemo(() => {
        if (file) {
            var newData = []
            for (const [idx, row] of Object.entries(file)) {
                var newRow = []
                for (const [j, item] of Object.entries(row)) {
                    newRow.push(<TableCell key={j}>{item}</TableCell>)
                }
                newData.push(<CustomTablerow shaded={skipFirst && parseInt(idx) === 0} key={idx}>{newRow}</CustomTablerow>)
            }
            return newData
        }
    }, [file, skipFirst])

    const handleCheck = (e) => {
        setSkipFirst(!skipFirst)
    }

    /**
     * Check passed in posting conditions
     * This is a way for the parent to control whether or not
     * the file can be posted based on other conditions of the parent
     */
    useEffect(() => {
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

    const headers = useMemo(() => {
        if (props.colHeaders) {
            var headerRow = []
            for (const [i, item] of Object.entries(props.colHeaders)) {
                headerRow.push(<TableCell key={i}>{item}</TableCell>)
            }
            return <TableHead sx={{ background: '#eeeeee' }}>
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
                    disabled={!(file && tableRows && meetsPostConditions)}
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
                    checked={skipFirst}
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
                            {tableRows ?? <TableRow><TableCell>Please upload a file</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    )
}

export default CSVTable