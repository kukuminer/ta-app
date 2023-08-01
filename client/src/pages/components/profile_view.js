import { useState, useEffect } from "react"
import getUser from "../../getUser"
import axios from "axios"


const GET_URL = "/api/user/" // /userId
const AUX_GET_URL = {
    'applicant': "/api/user/student/",
    'professor': null,
    'admin': null,
}

const ProfileView = () => {
    const [state, setState] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            const url = GET_URL + getUser()

            try {
                const res1 = await axios.get(url)
                console.log(res1)
                const auxURL = AUX_GET_URL[res1?.data[0].usertype]
                const res2 = auxURL && await axios.get(auxURL)

                setState(s => {return {...s, ...res1?.data[0], ...res2?.data[0]}})
            }
            catch (error) {
                console.log('error fetching in profile banner:', error)
            }
            

            // setState(res.data.length > 0 ? res.data[0] : { usertype: 'applicant' })
        }

        fetchData()
    }, [])

    console.log(state)
    return (
        <>
            profile banner
            {}
        </>
    )
}

export default ProfileView