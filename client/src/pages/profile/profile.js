import React from "react"
import { Navigate } from "react-router-dom"
import getUser from "../../getUser"
import axios from "axios"
import { Alert, Button, FormControl, TextField } from "@mui/material"
import StudentProfile from "./student/student_profile"
import './profile.css'

const GET_URL = "/api/user/" // /userId
const POST_URL = "/api/user/update"
const POST_AUX_URL = {
    'applicant': "/api/user/student/update",
    'professor': null,
    'admin': null,
}

const Profile = () => {
    const [state, setState] = React.useState({
        firstname: '',
        lastname: '',
        email: '',
        usertype: 'loading',
        username: '',
    })

    const [alert, setAlert] = React.useState({
        visible: false,
        html: <Alert severity="error">Failed to update. Please try again</Alert>
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

    async function handleSubmit(event) {
        event.preventDefault()
        setAlert(old => {
            return {
                ...old,
                visible: false,
            }
        })
        const body = {
            userId: getUser(),
            state: state,
        }

        var res

        try {
            res = await axios.post(POST_URL, body)
        }
        catch (error) {
            res = error.response
        }
        var res2 = { status: 200 }
        if (res.status === 200) {
            const url2 = POST_AUX_URL[res.data[0].usertype]
            if (url2) {
                try {
                    res2 = await axios.post(url2, body)
                }
                catch (error) {
                    res2 = error.response
                }
            }
        }
        if (res2.status === 200 && res.status === 200) {
            setAlert(old => {
                return {
                    ...old,
                    html: <Navigate to="/dashboard" />,
                    visible: true,
                }
            })
        } else {
            setAlert(old => {
                return {
                    ...old,
                    visible: true,
                }
            })
        }
    }

    function chooseComponent(usertype) {
        switch (usertype) {
            case 'applicant': return <StudentProfile setParentState={setStateFromChild} />
            case 'admin': return null
            case 'professor': return null
            case 'loading': return <p>Loading...</p>
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
                                type="email"
                            />
                            {chooseComponent(state.usertype)}
                            {alert.visible ? alert.html : null}
                            <Button variant="contained" type="submit">Save</Button>
                        </FormControl>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Profile