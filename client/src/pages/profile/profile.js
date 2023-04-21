import React from "react"
import getUser from "../../getUser"
import axios from "axios"
import { Button, FormControl, TextField } from "@mui/material"

const GET_URL = "/api/user/" // /userId

const Profile = () => {
    const [state, setState] = React.useState({
        firstname: '',
        lastname: '',
        email: '',
        usertype: '',
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
                if (res.data) {
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
    console.log(state)

    function handleChange(event) {
        console.log(event.target.id, event.target.value)
        setState((old) => {
            var news = structuredClone(old)
            news[event.target.id] = event.target.value
            return news
        })
    }

    function handleSubmit(event) {
        event.preventDefault()
        console.log('form submitted')
    }

    return (
        <>
            <div className="profile">
                <main>
                    <h1>
                        Profile
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
                            <Button variant="contained" type="submit">Save and exit</Button>
                        </FormControl>
                    </form>
                </main>
            </div>
        </>
    )
}

export default Profile