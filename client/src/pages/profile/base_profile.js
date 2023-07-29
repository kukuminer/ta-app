import { FormControl, TextField } from "@mui/material"
import React from "react"
// import getUser from "../../getUser"
// import axios from "axios"

const BaseProfile = ({ state, updateState }) => {

    function handleChange(event) {
        var newState = structuredClone(state)
        newState[event.target.id] = event.target.value
        updateState(newState)
    }

    // React.useEffect(() => {
    //     console.log(childState)
    //     updateState(state)
    // }, [state, updateState, childState])

    return (
        <>
            <FormControl margin="normal">
                <div sx={{ display: 'flex', flexDirection: "row", justifyContent: 'center' }}>
                    <TextField
                        required
                        id="firstname"
                        value={state?.firstname ?? ''}
                        error={!state?.firstname}
                        onChange={handleChange}
                        label="First Name"
                        margin="normal"
                    />
                    <TextField
                        required
                        id="lastname"
                        value={state?.lastname ?? ''}
                        error={!state?.lastname}
                        onChange={handleChange}
                        label="Surname"
                        margin="normal"
                    />
                </div>
                <TextField
                    required
                    id="email"
                    value={state?.email ?? ''}
                    error={!state?.email}
                    onChange={handleChange}
                    label="Email"
                    margin="normal"
                    type="email"
                />
            </FormControl>

        </>
    )
}

export default BaseProfile