import { useState, useEffect } from "react"
import getUser from "../../../getUser"
import axios from "axios"


const GET_URL = "/api/user/" // /userId
const AUX_GET_URL = {
    'applicant': "/api/user/student/",
    'professor': null,
    'admin': null,
}

const DATA_MAP = {
    'firstname': 'First name',
    'lastname': 'Surname',
    'email': 'Email',
}
const DATA_MAP_AUX = {
    'applicant': {
        'studentnum': 'Student Number',
        'employeeid': 'Employee ID',
        'pool': 'Applicant pool',
    },
    'professor': {},
    'admin': {},
}

const ProfileView = () => {
    const [state, setState] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            const url = GET_URL + getUser()

            try {
                const res1 = await axios.get(url)
                var auxURL = AUX_GET_URL[res1?.data[0].usertype]
                const res2 = auxURL && await axios.get(auxURL + getUser())
                console.log(res2.data)

                setState(s => { return { ...s, ...res1?.data[0], ...res2?.data } })
            }
            catch (error) {
                console.log('error fetching in profile banner:', error)
            }


            // setState(res.data.length > 0 ? res.data[0] : { usertype: 'applicant' })
        }

        fetchData()
    }, [])

    return (
        <>
            <div>
                <h2>
                    Profile data:
                </h2>
                <div className="profile-banner-row">
                    {
                        Object.entries(DATA_MAP).map(v => {
                            return <p>{v[1]}: {state[v[0]]}&emsp;</p>
                        })
                    }
                </div>
                {state.usertype && 
                    <div className="profile-banner-row">
                        {
                            Object.entries(DATA_MAP_AUX[state?.usertype]).map(v => {
                                return <p>{v[1]}: {state[v[0]]}&emsp;</p>
                            })
                        }
                    </div>
                }
            </div>
        </>
    )
}

export default ProfileView