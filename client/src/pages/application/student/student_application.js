import { useParams } from "react-router-dom"
import React from "react"

const StudentApplication = () => {
    const { term } = useParams()

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
                    <input type="number" min={0} max={20} />
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