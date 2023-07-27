import { FormControl, TextField } from "@mui/material"

const BaseProfile = ({state, updateState}) => {
    console.log(state)
    function handleChange(event) {
        state[event.target.id] = event.target.value
        console.log(state)
        updateState(state)
    }

    return (
        <>
            <FormControl margin="normal">
                <div sx={{ display: 'flex', flexDirection: "row", justifyContent: 'center' }}>
                    <TextField
                        required
                        id="firstname"
                        value={state.firstname}
                        error={!state.firstname}
                        onChange={handleChange}
                        label="First Name"
                        margin="normal"
                    />
                    <TextField
                        required
                        id="lastname"
                        value={state.lastname}
                        error={!state.lastname}
                        onChange={handleChange}
                        label="Surname"
                        margin="normal"
                    />
                </div>
                <TextField
                    required
                    id="email"
                    value={state.email}
                    error={!state.email}
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