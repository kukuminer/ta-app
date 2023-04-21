import React from "react"
import getUser from "../../getUser"
import axios from "axios"
import { Button, FormControl, TextField } from "@mui/material"
import StudentProfile from "./student/student_profile"
import './profile.css'

const GET_URL = "/api/user/" // /userId
const POST_URL = "/api/user/update"
const POST_AUX_URL = {
    'student': "/api/user/student/update",
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

    const setStateFromChild = React.useCallback((newState) => {
        setState(newState)
    }, [])

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
        console.log(state)
        const body = {
            userId: getUser(),
            state: state,
        }
        axios.post(POST_URL, body)
            .then((res) => {
                console.log(res.data)
                const url2 = POST_AUX_URL[res.data[0].usertype]
                console.log(url2)
                if (url2) {
                    axios.post(url2, body)
                        .then((res) => {
                            console.log(res.status)
                        })
                }
            })
    }

    function chooseComponent(usertype) {
        switch (usertype) {
            case 'student': return <StudentProfile setParentState={setStateFromChild} />
            case 'admin': return null
            case 'professor': return null
            default: throw new Error("Unknown usertype!")
        }
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
                            />
                            {chooseComponent(state.usertype)}
                            <Button variant="contained" type="submit">Save and exit</Button>
                        </FormControl>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Profile