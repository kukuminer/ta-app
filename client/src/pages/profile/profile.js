import { useState, useEffect } from 'react';
import { Navigate } from "react-router-dom"
import getUser from "../../getUser"
import axios from "axios"
import { Alert, Button, FormControl } from "@mui/material"
import StudentProfile from "./student/student_profile"
import BaseProfile from "./base_profile"
import './profile.css'

const GET_URL = "/api/user/" // /userId
const POST_URL = "/api/user/update"
const POST_AUX_URL = {
    'applicant': "/api/user/student/update",
    'professor': null,
    'admin': null,
}

const Profile = () => {

    const [state, setState] = useState({})

    // const [alert, setAlert] = React.useState({
    //     visible: false,
    //     html: <Alert severity="error">Failed to update. Please try again</Alert>
    // })

    useEffect(() => {
        const fetchData = async () => {
            const url = GET_URL + getUser()
            const res = await axios.get(url)
            
            setState(res.data.length > 0 ? res.data[0] : { usertype: 'applicant' })
            // setState(res.data[0])
        }

        fetchData()
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const res1 = await axios.post(POST_URL, {state})
            const res2 = await axios.post(POST_AUX_URL[state.usertype], {state})
        }
        catch (error) {
            console.log(error)
        }
    }

    console.log(state)
    return (
        <>
            <div className="profile">
                <div className="main">
                    <h1>
                        TA Application System Profile
                    </h1>
                    <form>
                        <FormControl margin="normal">
                            <BaseProfile updateState={setState} state={state} />
                            {state?.usertype === 'applicant' && <StudentProfile updateState={setState} state={state} />}
                            {/* {alert.visible ? alert.html : null} */}
                            <Button variant="contained" type="submit" onClick={handleSubmit}>Save</Button>
                        </FormControl>
                    </form>
                </div>
            </div>
        </>
    )


    //     const [state, setState] = React.useState({
    //         // firstname: '',
    //         // lastname: '',
    //         // email: '',
    //         usertype: 'loading',
    //         // username: '',
    //     })

    //     const [alert, setAlert] = React.useState({
    //         visible: false,
    //         html: <Alert severity="error">Failed to update. Please try again</Alert>
    //     })

    //     const setStateFromChild = React.useCallback((newState) => {
    //         console.log(newState)
    //         setState(newState)
    //     }, [setState])

    //     async function getUserInfo() {
    //         const url = GET_URL + getUser()
    //         const res = await axios.get(url)
    //         const r = res.data[0]
    //         if (r) {
    //             for (const [key, val] of Object.entries(r)) {
    //                 setState(old => {
    //                     var ret = { ...old }
    //                     ret[key] = val
    //                     return ret
    //                 })
    //             }
    //         } else { //User doesn't exist, make new applicant!
    //             setState(old => {
    //                 return {
    //                     ...old,
    //                     usertype: 'applicant',
    //                 }
    //             })
    //             // state['usertype'] = 'applicant';
    //         }
    //     }

    //     React.useEffect(() => {
    //         getUserInfo()
    //     })

    //     async function handleSubmit(event) {
    //         event.preventDefault()
    //         setAlert(old => {
    //             return {
    //                 ...old,
    //                 visible: false,
    //             }
    //         })
    //         const body = {
    //             userId: getUser(),
    //             state: state,
    //         }

    //         var res

    //         try {
    //             res = await axios.post(POST_URL, body)
    //         }
    //         catch (error) {
    //             res = error.response
    //         }
    //         var res2 = { status: 200 }
    //         if (res.status === 200) {
    //             const url2 = POST_AUX_URL[res.data[0].usertype]
    //             if (url2) {
    //                 try {
    //                     res2 = await axios.post(url2, body)
    //                 }
    //                 catch (error) {
    //                     res2 = error.response
    //                 }
    //             }
    //         }
    //         if (res2.status === 200 && res.status === 200) {
    //             setAlert(old => {
    //                 return {
    //                     ...old,
    //                     html: <Navigate to="/dashboard" />,
    //                     visible: true,
    //                 }
    //             })
    //         } else {
    //             setAlert(old => {
    //                 return {
    //                     ...old,
    //                     visible: true,
    //                 }
    //             })
    //         }
    //     }

    //     function chooseComponent(usertype) {
    //         switch (usertype) {
    //             case 'applicant': return <StudentProfile updateState={setStateFromChild} state={state} />
    //             case 'admin': return null
    //             case 'professor': return null
    //             case 'loading': return <p>Loading...</p>
    //             default: throw new Error("Unknown usertype!")
    //         }
    //     }

    // return (
    //     <>
    //         <div className="profile">
    //             <div className="main">
    //                 <h1>
    //                     TA Application System Profile
    //                 </h1>
    //                 <form onSubmit={handleSubmit}>
    //                     <FormControl margin="normal">
    //                         <BaseProfile updateState={setStateFromChild} state={state} />
    //                         {chooseComponent(state.usertype)}
    //                         {alert.visible ? alert.html : null}
    //                         <Button variant="contained" type="submit">Save</Button>
    //                     </FormControl>
    //                 </form>
    //             </div>
    //         </div>
    //     </>
    // )
}

export default Profile