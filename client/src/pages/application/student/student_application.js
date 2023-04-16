import { useLocation } from "react-router-dom"
import React from "react"
import axios from "axios"
import getUser from "../../../getUser"
import Application from "../../components/application_course"

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
            if (!this.state[k]) this.state[k] = v
        }

        this.url = '/api/student/applications/' + this.state.term + '/' + getUser()
        this.courseData = []
        
        // this.fetchTable()
    }
    componentDidMount() {
        this.fetchTable()
    }

    defaultValues = {
        approval: false,
        availability: 0,
        explanation: '',
        incanada: false,
        wantstoteach: false,
    }

    handleChange = (changedKey, event) => {
        // this.state[changedKey] = event.target.value
        const stateCopy = this.state
        if (event.target.type === "checkbox") {
            stateCopy[changedKey] = event.target.checked
        }
        else {
            stateCopy[changedKey] = event.target.value
        }
        this.setState(stateCopy)
        console.log('changed', changedKey, '... newval:', this.state[changedKey])
    }

    // termapplication info:
    fetchTable() {
        axios.get(this.url)
            .then((res) => {
                const table = res.data
                var courseData = []
                for(const [key, item] of Object.entries(table)) {
                    courseData.push(<Application data={item} rowKey={key} key={key} />)
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
                        {
                            !this.state.courseData ? <p>loading...</p> : this.state.courseData
                            // !this.courseData ? <p>loading...</p> : this.courseData.map((val, key) => {
                            //     console.log('hello')
                            //     return (
                            //         <>
                            //             Hello
                            //             <Application data={val} rowKey={key} key={key} />
                            //         </>
                            //     )
                            // })
                        }
                    </form>
                </div>
            </>
        )
    }
}

export default StudentApplication