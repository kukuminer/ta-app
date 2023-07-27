import "./login.css"
import React from "react";
import axios from 'axios'
import { Navigate } from "react-router-dom"
import getUser from "../../getUser";
import { FormControl, TextField, Button } from "@mui/material";

const NO_USER_NAVIGATE = '/profile'
const DEFAULT_NAVIGATE = '/dashboard'
const USER_URL = '/api/usertype/'

const Login = (props) => {
    const [target, setTarget] = React.useState(props.target ? props.target : DEFAULT_NAVIGATE)
    const [ready, setReady] = React.useState(false)
    const [formState, setFormState] = React.useState({})

    React.useEffect(() => {
        const url = USER_URL + getUser()
        axios.get(url)
            .then((res) => {
                console.log(res.data)
                if (!res.data.usertype) {
                    setTarget(NO_USER_NAVIGATE)
                    setReady(true)
                }
                else {
                    setReady(true)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    function handleChange() {

    }

    function handleSubmit() {

    }

    return (
        <>
            <div className="profile">
                <div className="main">
                    <h1>
                        TA Application System - Create User
                    </h1>
                    <form onSubmit={handleSubmit}>
                        <FormControl margin="normal">
                            <div sx={{ display: 'flex', flexDirection: "row", justifyContent: 'center' }}>
                                <TextField
                                    required
                                    id="firstname"
                                    value={formState.firstname}
                                    error={!formState.firstname}
                                    onChange={handleChange}
                                    label="First Name"
                                    margin="normal"
                                />
                                <TextField
                                    required
                                    id="lastname"
                                    value={formState.lastname}
                                    error={!formState.lastname}
                                    onChange={handleChange}
                                    label="Surname"
                                    margin="normal"
                                />
                            </div>
                            <TextField
                                required
                                id="email"
                                value={formState.email}
                                error={!formState.email}
                                onChange={handleChange}
                                label="Email"
                                margin="normal"
                                type="email"
                            />
                            <Button variant="contained" type="submit">Save</Button>

                        </FormControl>
                    </form>

                    {ready ? <Navigate to={target} /> : <p>Redirecting...</p>}
                </div>
            </div>
        </>
    )
}


export default Login;