import { useLocation } from "react-router-dom"
import React from "react"
import axios from "axios"
import getUser from "../../../getUser"
import Application from "../../components/application_course"
import { Button } from "@mui/material"

/**
 * Wraps the StudentApplication component to properly pass in the useLocation hook
 * @returns JSX component with props passed in from Link component
 */
const StudentApplication = () => {
    const location = useLocation()
    return <StudentApplicationClass state={location.state} />
}

class StudentApplicationClass extends React.Component {
    POST_URL = '/api/student/term'
    DEFAULT_VALUES = {
        approval: false,
        availability: 0,
        explanation: '',
        incanada: false,
        wantstoteach: false,
        submitted: false,
    }
    TIMER = null

    constructor(props) {
        super(props)
        this.state = {}
        this.state.term = props.state.term
        this.state.userId = getUser()

        // Initialize state to default values if it is null:
        for (const [k, v] of Object.entries(this.DEFAULT_VALUES)) {
            if (!this.state[k]) this.state[k] = v
        }
        console.log(this.state)

        this.get_courses_url = '/api/student/applications/' + this.state.term + '/' + this.state.userId
        this.get_term_url = '/api/student/termapplication/' + this.state.term + '/' + this.state.userId
        this.courseData = []
    }
    componentDidMount() {
        this.fetchApp()
        this.fetchTable()
    }
    componentWillUnmount() {
        clearTimeout(this.TIMER)
    }

    handleChange = (changedKey, event) => {
        // this.state[changedKey] = event.target.value
        const stateCopy = this.state
        if (event.target.type === "checkbox") {
            stateCopy[changedKey] = event.target.checked
        }
        else if (changedKey === 'submitted') {
            stateCopy[changedKey] = !this.state.submitted
        }
        else {
            stateCopy[changedKey] = event.target.value
        }
        this.setState(stateCopy, () => {
            const body = {
                userId: this.state.userId,
                term: this.state.term,
                submitted: this.state.submitted,
                availability: this.state.availability,
                approval: this.state.approval,
                explanation: this.state.explanation,
                incanada: this.state.incanada,
                wantstoteach: this.state.wantstoteach,
            }
            clearTimeout(this.TIMER)
            this.TIMER = setTimeout(
                function () {
                    axios.post(this.POST_URL, body)
                        .then((res) => {
                            this.setState({
                                submitted: res.data[0].submitted,
                                availability: res.data[0].availability,
                                approval: res.data[0].approval,
                                explanation: res.data[0].explanation,
                                incanada: res.data[0].incanada,
                                wantstoteach: res.data[0].wantstoteach,
                            })
                            console.log(this.state)
                        })
                    return () => clearTimeout(this.TIMER)
                }
                    .bind(this),
                500
            )
        })
    }

    // termapplication info:
    fetchApp() {
        axios.get(this.get_term_url)
            .then((res) => {
                const newState = res.data[0]
                for (const [k, v] of Object.entries(this.DEFAULT_VALUES)) {
                    if (!newState[k]) newState[k] = v
                }
                this.setState(newState)
            })
    }

    // application info:
    fetchTable() {
        axios.get(this.get_courses_url)
            .then((res) => {
                const table = res.data
                var courseData = []
                for (const [key, item] of Object.entries(table)) {
                    courseData.push(<Application data={item} term={this.state.term} rowKey={key} key={key} />)
                }
                var stateCopy = this.state
                stateCopy.courseData = courseData
                this.setState(stateCopy)
            })
    }

    render() {
        return (
            <>
                <div className="application">
                    <h2>
                        TA Application for {this.state ? this.state.term : 'Loading...'}
                    </h2>
                    <form className="form">
                        <h3>General Info</h3>
                        <div className="form-row">
                            Availability in hours per week (0-20):
                            <input type="number" min={0} max={20} value={this.state.availability} onChange={(event) => this.handleChange('availability', event)} />
                        </div>
                        <div className="form-row">
                            Provide a brief explanation of which courses you want to TA for, and your relevant experience
                            <br />
                            <textarea value={this.state.explanation} onChange={(event) => this.handleChange('explanation', event)} />
                        </div>
                        <div className="form-row">
                            <label>
                                <input type="checkbox" checked={this.state.approval} onChange={(event) => this.handleChange('approval', event)} />
                                I have my advisor's / supervisor's approval (Leave blank if not a grad student)
                            </label>
                        </div>
                        <div className="form-row">
                            <label>
                                <input type="checkbox" checked={this.state.incanada} onChange={(event) => this.handleChange('incanada', event)} />
                                I will be able to attend the required lab sessions in person this semester
                            </label>
                        </div>
                        <div className="form-row">
                            <label>
                                <input type="checkbox" checked={this.state.wantstoteach} onChange={(event) => this.handleChange('wantstoteach', event)} />
                                I want to be a teaching assistant this semester
                            </label>
                        </div>
                        <h3>Course Preferences</h3>
                        <table>
                            <tbody>
                                <tr>
                                    <th>Course</th>
                                    <th>Title</th>
                                    <th>Grade</th>
                                    <th>Interest</th>
                                    <th>Qualification</th>
                                    <th></th>
                                </tr>
                                {!this.state.courseData ? <tr><td>loading...</td></tr> : this.state.courseData}

                            </tbody>
                        </table>
                        <p>
                            Your changes are saved automatically. You can unsubmit later.
                        </p>
                        <Button variant="contained"
                            size="large"
                            onClick={(event) => this.handleChange('submitted', event)}
                        >
                            {this.state.submitted ? 'Unsubmit' : 'Submit'}
                        </Button>
                    </form>
                </div>
            </>
        )
    }
}

export default StudentApplication