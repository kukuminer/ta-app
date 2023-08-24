import getUser from "../../../getUser"
import { useEffect } from 'react';
import axios from "axios"
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material"

const GET_URL = "/api/applicant/" // /userId
const POOL_OPTIONS = [
    <MenuItem key='unit 1' id={'unit 1'} value={'unit 1'}>Unit 1 (Full time Graduate student at York)</MenuItem>,
    <MenuItem key='unit 2' id={'unit 2'} value={'unit 2'}>Unit 2 (All other applicants)</MenuItem>,
    // <MenuItem key='N/A' value={'none'}>Neither</MenuItem>
]

const DEFAULT_VALS = {
    studentnum: '',
    employeeid: '',
    pool: 'unit 2',
}

const StudentProfile = ({ state, updateState }) => {
    // const [state, setState] = React.useState({
    //     studentNum: '',
    //     employeeId: '',
    //     pool: '',
    // })

    // React.useEffect(() => {
    //     const url = GET_URL + getUser()
    //     axios.get(url)
    //         .then((res) => {
    //             const r = res.data
    //             if (r) {
    //                 for (const [key, val] of Object.entries(r)) {
    //                     state[key] = val
    //                 }
    //                 updateState(state)
    //             }
    //         })
    // }, [state, updateState])

    useEffect(() => {
        const fetchData = async () => {
            // const fetchedState = {}
            const url = GET_URL + getUser()
            try {
                const res = await axios.get(url)
                console.log(res.data)

                updateState({ ...state, ...(res.data ?? DEFAULT_VALS), studentfetched: true })
            }
            catch (error) {
                updateState({ ...state, studentfetched: false })
                console.log('error fetching student data: ', error)
            }
        }

        if (!state.studentfetched) {
            fetchData()
        }
    }, [state, updateState])

    function handleChange(event) {
        var newState = structuredClone(state)
        // ?? event.target.name to accommodate the Select dropdown
        newState[event.target.id ?? event.target.name] = event.target.value
        updateState(newState)
    }

    return (
        <>
            <TextField
                id="studentnum"
                value={state?.studentnum ?? DEFAULT_VALS.studentnum}
                error={!state?.studentnum}
                onChange={handleChange}
                label="Student Number (9 digits)"
                margin="normal"
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]{9}' }}

            />
            <TextField
                id="employeeid"
                value={state?.employeeid ?? DEFAULT_VALS.employeeid}
                error={!state?.employeeid}
                onChange={handleChange}
                label="Employee ID (9 digits)"
                margin="normal"
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]{9}' }}
            />
            <FormControl margin="normal">
                <InputLabel id="pool-select">I am</InputLabel>
                <Select
                    labelId="pool-select"
                    id="pool"
                    value={state?.pool ?? DEFAULT_VALS.pool}
                    error={!state?.pool}
                    onChange={handleChange}
                    label="I am"
                    name="pool"
                    required
                >
                    {POOL_OPTIONS}
                </Select>

            </FormControl>
        </>
    )
}

export default StudentProfile