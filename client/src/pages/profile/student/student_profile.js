import getUser from "../../../getUser"
import React from "react"
import axios from "axios"
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material"

const GET_URL = "/api/user/student/" // /userId
const POOL_OPTIONS = [
    <MenuItem key='unit 1' value={'unit 1'}>Undergrad/Not a student</MenuItem>,
    <MenuItem key='unit 2' value={'unit 2'}>Graduate student</MenuItem>,
    // <MenuItem key='N/A' value={'none'}>Neither</MenuItem>
]

/**
 * For mapping the SQL response to the appropriate state variable
 */
const map = {
    'studentNum': 'studentnum',
    'employeeId': 'employeeid',
    'pool': 'pool',
}

const StudentProfile = ({ setParentState }) => {
    const [state, setState] = React.useState({
        studentNum: '',
        employeeId: '',
        pool: '',
    })

    React.useEffect(() => {
        const url = GET_URL + getUser()
        axios.get(url)
            .then((res) => {
                const r = res.data
                console.log(r)
                if(r) {
                    setState(old => {
                        return {
                            ...old,
                            studentNum: r[map['studentNum']] ? r[map['studentNum']] : '',
                            employeeId: r[map['employeeId']] ? r[map['employeeId']] : '',
                            pool: r[map['pool']] ? r[map['pool']] : '',
                        }
                    })
                }
            })
    }, [])

    React.useEffect(() => {
        setParentState(old => {
            return {
                ...old,
                ...state,
            }
        })
    }, [setParentState, state])

    function handleChange(event) {
        setState((old) => {
            var news = structuredClone(old)
            news[event.target.id ? event.target.id : event.target.name] = event.target.value
            return news
        })
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