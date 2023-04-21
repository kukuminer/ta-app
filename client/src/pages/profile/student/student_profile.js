import React from "react"
import getUser from "../../../getUser"
import axios from "axios"
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material"

const GET_URL = "/api/user/student/" // /userId
const POOL_OPTIONS = [
    <MenuItem key='UTA' value={'UTA'}>Undergrad</MenuItem>,
    <MenuItem key='GTA' value={'GTA'}>Graduate</MenuItem>,
    <MenuItem key='N/A' value={'N/A'}>Neither</MenuItem>
]

const StudentProfile = ({ setParentState }) => {
    const [state, setState] = React.useState({
        studentid: '',
        pool: '',
    })

    React.useEffect(() => {
        const url = GET_URL + getUser()
        axios.get(url)
            .then((res) => {
                const r = res.data
                setState(old => {
                    return {
                        ...old,
                        studentid: r.studentid ? r.studentid : '',
                        pool: r.pool ? r.pool : '',
                    }
                })

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
                required
                id="studentid"
                value={state.studentid}
                error={!state.studentid}
                onChange={handleChange}
                label="Student Number"
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