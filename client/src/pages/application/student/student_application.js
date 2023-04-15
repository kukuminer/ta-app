import { useLocation } from "react-router-dom"
import React from "react"

/**
 * Wraps the StudentApplication component to properly pass in the useLocation hook
 * @returns JSX component with props passed in from Link component
 */
const StudentApplication = () => {
    const location = useLocation()
    return <StudentApplicationClass state={location.state} />
}

class StudentApplicationClass extends React.Component {
    constructor(props) {
        super(props)
        this.state = props.state

        // Initialize state to default values if it is null:
        for (const [k, v] of Object.entries(this.defaultValues)) {
            if(!this.state[k]) this.state[k] = v
        }
    }
    
    defaultValues = {
        approval: false,
        availability: 0,
        explanation: '',
        incanada: false,
        wantstoteach: false,
    }

    

    // termapplication info:
    // const [availability, setAvailability] = React.useState(state.availability)
    // const [approval, setApproval] = React.useState(state.approval)
    // const [explanation, setExplanation] = React.useState(state.explanation)

    // const [courseTable, setCourseTable] = React.useState(null)

    render() {
        return (
            <>
                <div className="application">
                    <h2>
                        TA Application for {this.state ? this.state.term : 'Loading...'}
                    </h2>
                    <form className="form">
                        <h3>General Info</h3>
                        Hours available (0-20):
                        <br />
                        <input type="number" min={0} max={20} value={this.state.availability} onChange={(event) => this.setState({availability: event.target.value})}/>
                        <br />
                        <label>
                            <input type="checkbox" value={this.state.approval}/>
                            I have my advisor's / supervisor's approval
                        </label>
                        <br />
                        <h3>Course Preferences</h3>
                    </form>
                </div>
            </>
        )
    }
}

export default StudentApplication