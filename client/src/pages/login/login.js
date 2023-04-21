import "./login.css"
import React from "react";
import axios from 'axios'
import { Navigate } from "react-router-dom"
import getUser from "../../getUser";

const NO_USER_NAVIGATE = '/profile'
const DEFAULT_NAVIGATE = '/dashboard'
const USER_URL = '/api/usertype/'

const Login = (props) => {
    const [target, setTarget] = React.useState(props.target ? props.target : DEFAULT_NAVIGATE)
    const [ready, setReady] = React.useState(false)

    React.useEffect(() => {
        const url = USER_URL + getUser()
        axios.get(url)
            .then((res) => {
                console.log(res.data)
                if(!res.data.usertype) {
                    setTarget(NO_USER_NAVIGATE)
                    setReady(true)
                }
                else{
                    setReady(true)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])


    return (
        <>
        hello
            {ready ? <Navigate to={target} /> : <p>Redirecting...</p>}
        </>
    )
}


export default Login;