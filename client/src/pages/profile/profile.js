import React from "react"
import getUser from "../../getUser"
import axios from "axios"
import { Button, FormControl, TextField } from "@mui/material"
import StudentProfile from "./student/student_profile"
import './profile.css'

const GET_URL = "/api/user/" // /userId
const BASE_PROFILE_URL = "/api/user/update"
const COMPONENTS = {
    'student': <StudentProfile />,
    'professor': null,
    'admin': null,
}

const Profile = () => {
    const [state, setState] = React.useState({
        firstname: '',
        lastname: '',
        email: '',
        usertype: 'student',
        username: '',
    })

    React.useEffect(() => {
        getUserInfo()
    }, [])

    function getUserInfo() {
        const url = GET_URL + getUser()
        axios.get(url)
            .then((res) => {
                const r = res.data[0]
                if (r) {
                    setState(old => {
                        return {
                            ...old,
                            firstname: r.firstname,
                            lastname: r.lastname,
                            email: r.email,
                            usertype: r.usertype,
                            username: r.username,
                        }
                    })
                }
            })
    }

    function handleChange(event) {
        setState((old) => {
            var news = structuredClone(old)
            news[event.target.id] = event.target.value
            return news
        })
    }

    function handleSubmit(event) {
        event.preventDefault()
        console.log('form submitted')
        const body = {
            userId: getUser(),
            state: state,
        }
        axios.post(BASE_PROFILE_URL, body)
            .then((res) => {
                console.log(res.status)
            })
    }

    return (
        <>
            <div className="profile">
                <div className="main">
                    <h1>
                        TA Application System Profile
                    </h1>
                    <form onSubmit={handleSubmit}>
                        <FormControl margin="normal">
                            <div sx={{ display: 'flex', flexDirection: "row", justifyContent: 'center' }}>
                                <TextField
                                    required
                                    id="firstname"
                                    value={state.firstname}
                                    error={!state.firstname}
                                    onChange={handleChange}
                                    label="First Name"
                                />
                                <TextField
                                    required
                                    id="lastname"
                                    value={state.lastname}
                                    error={!state.lastname}
                                    onChange={handleChange}
                                    label="Surname"
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
                            />
                            {COMPONENTS[state.usertype]}
                            <Button variant="contained" type="submit">Save and exit</Button>
                        </FormControl>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Profile