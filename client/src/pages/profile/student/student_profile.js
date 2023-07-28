import getUser from "../../../getUser"
import React from "react"
import axios from "axios"
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material"

const GET_URL = "/api/user/student/" // /userId
const POOL_OPTIONS = [
    <MenuItem key='unit 2' id={'unit 2'} value={'unit 2'}>Unit 2 (All other applicants)</MenuItem>,
    <MenuItem key='unit 1' id={'unit 1'} value={'unit 1'}>Unit 1 (Full time Graduate student at York)</MenuItem>,
    // <MenuItem key='N/A' value={'none'}>Neither</MenuItem>
]

/**
 * For mapping the SQL response to the appropriate state variable
 */
// const map = {
//     'studentNum': 'studentnum',
//     'employeeId': 'employeeid',
//     'pool': 'pool',
// }

const StudentProfile = ({ state, updateState }) => {
    // const [state, setState] = React.useState({
    //     studentNum: '',
    //     employeeId: '',
    //     pool: '',
    // })

    React.useEffect(() => {
        const url = GET_URL + getUser()
        axios.get(url)
            .then((res) => {
                const r = res.data
                if (r) {
                    for (const [key, val] of Object.entries(r)) {
                        state[key] = val
                    }
                    updateState(state)
                }
            })
    }, [state, updateState])

    function handleChange(event) {
        state[event.target.id] = event.target.value
        updateState(state)
    }

    return (
        <>
            <TextField
                id="studentNum"
                value={state.studentNum}
                error={!state.studentNum}
                onChange={handleChange}
                label="Student Number (9 digits)"
                margin="normal"
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]{9}' }}

            />
            <TextField
                id="employeeId"
                value={state.employeeId}
                error={!state.employeeId}
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
                    value={state.pool ? state.pool : ''}
                    error={!state.pool}
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