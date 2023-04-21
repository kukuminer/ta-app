import React from "react"
import getUser from "../../../getUser"
import axios from "axios"

const GET_URL = "/api/user/student/" // /userId

const StudentProfile = ({setParentState}) => {
    const [state, setState] = React.useState({
        studentid: '',
        pool: '',
    })

    // const liftStateToParent = React.useCallback(() => {
    //     // function liftStateToParent() {
        // setParentState(old => {
        //     return {
        //         ...old,
        //         ...state,
        //     }
        // })

    // }, [setParentState, state])

    React.useEffect(() => {
        const url = GET_URL + getUser()
        axios.get(url)
            .then((res) => {
                const r = res.data
                setState(old => {
                    return {
                        ...old,
                        studentid: r.studentid,
                        pool: r.pool,
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
    console.log(state)


    // props.setParentState(old => {
    //     return {
    //         ...old,
    //         ...state,
    //     }
    // })

    return (
        <>
            hello student
        </>
    )
}

export default StudentProfile