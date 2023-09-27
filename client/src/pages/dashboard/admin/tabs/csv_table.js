import { Paper, Table, TableBody, TableCell, TableContainer, TableRow, Button, Checkbox, TableHead } from '@mui/material'
import { styled } from '@mui/material/styles'
import React from 'react'
import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import Papa from 'papaparse'
// import { grey } from '@mui/material/colors'
import { LIGHT_GRAY, LIGHT_GREEN, LIGHT_RED, LIGHT_YELLOW } from '../../../../color'

const CustomTablerow = styled(TableRow, {
    shouldForwardProp: (prop) => prop !== 'color',
})(({ color }) => ({
    ...(color && {
        backgroundColor: color
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
    const [postResults, setPostResults] = useState(null)

    const postFile = () => {
        setLastPostStatus('Loading...')
        const body = props.postBody
        body.rows = skipFirst ? file.slice(1) : file
        axios.post(props.postURL, body)
            .then((res) => {
                if (res.data?.success) setPostResults(res.data?.data)
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
                    setPostResults(null)
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
                // Get content from file
                for (const [j, item] of Object.entries(row)) {
                    newRow.push(<TableCell key={j}>{item}</TableCell>)
                }
                // Determine the color, based on post feedback:
                var color = null
                if (skipFirst && parseInt(idx) === 0) {
                    color = LIGHT_GRAY
                    !!postResults && newRow.push(<TableCell key={'status'}></TableCell>)
                }
                else if (!!postResults) {
                    console.log(!!postResults)
                    const item = postResults[idx]
                    switch (item.status) {
                        case 'success': color = LIGHT_GREEN; break
                        case 'fail': color = LIGHT_RED; break
                        case 'conflict': color = LIGHT_YELLOW; break
                        default: color = null
                    }
                    newRow.push(<TableCell key={'status'}>{item.data}</TableCell>)
                }
                newData.push(<CustomTablerow color={color} key={idx}>{newRow}</CustomTablerow>)
            }
            return newData
        }
    }, [file, skipFirst, postResults])

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
            if(postResults) {
                headerRow.push(<TableCell key={'status'}>Post Status</TableCell>)
            }
            return <TableHead sx={{ background: '#eeeeee' }}>
                <TableRow key={'header-row'}>{headerRow}</TableRow>
            </TableHead>
        }
        return null
    }, [props, postResults])

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