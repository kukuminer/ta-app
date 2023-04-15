import { useLocation } from "react-router-dom"
import React from "react"

const StudentApplication = () => {
    const location = useLocation()
    const state = location.state
    const term = state.term
    console.log(state)

    // termapplication info:
    const [availability, setAvailability] = React.useState(state.availability)
    const [approval, setApproval] = React.useState(state.approval)
    const [explanation, setExplanation] = React.useState(state.explanation)

    const [courseTable, setCourseTable] = React.useState(null)

    return (
        <>
            <div className="application">
                <h2>
                    TA Application for {term ? term : 'Loading...'}
                </h2>
                <form className="form">
                    <h3>General Info</h3>
                    Hours available (0-20):
                    <br />
                    <input type="number" min={0} max={20} value={availability} onChange={(event) => setAvailability(event.target.value)}/>
                    <br />
                    <label>
                        <input type="checkbox" />
                        I have my advisor's / supervisor's approval
                    </label>
                    <br />
                    <h3>Course Preferences</h3>
                </form>
            </div>
        </>
    )
}

export default StudentApplication