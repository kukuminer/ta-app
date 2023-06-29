import { useLocation } from "react-router-dom"
import React from "react"
import axios from "axios"
import getUser from "../../../getUser"
import Application from "../../components/application_course"
import HtmlTooltip from "../../components/tooltip"
import { Button, IconButton, Table, TableBody, TableContainer, TableHead, TableRow, TextField } from "@mui/material"

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
    MAX_AVAILABILITY = 20
    MIN_AVAILABILITY = 0

    constructor(props) {
        super(props)
        this.state = {}
        this.state.term = props.state.term
        this.state.termname = props.state.termname
        this.state.userId = getUser()

        // Initialize state to default values if it is null:
        for (const [k, v] of Object.entries(this.DEFAULT_VALUES)) {
            if (!this.state[k]) this.state[k] = v
        }
        console.log(this.state)

        this.get_courses_url = '/api/student/applications/' + this.state.term + '/' + this.state.userId
        this.get_term_url = '/api/student/termapplication/' + this.state.term + '/' + this.state.userId
        this.get_refusal_url = '/api/student/refusal/' + this.state.term + '/' + this.state.userId
        this.courseData = []
    }
    componentDidMount() {
        this.fetchApp()
        this.fetchCourses().then(this.fetchRefusal())
        Promise.all([this.fetchCourses(), this.fetchRefusal()]).then((vals) =>
            this.makeTable(vals[0], vals[1])
        )

    }
    componentWillUnmount() {
        clearTimeout(this.TIMER)
    }
    async foo() {
        return 'foo'
    }
    async bar() {
        return 'bar'
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
        else if (changedKey === 'availability') {
            var val = event.target.value ? parseInt(event.target.value) : 0
            stateCopy[changedKey] = Math.max(this.MIN_AVAILABILITY, Math.min(this.MAX_AVAILABILITY, val))
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
                        .catch((error) => {
                            console.log('frontend error posting interest/qual changes:', error)
                        })
                    return () => clearTimeout(this.TIMER)
                }.bind(this),
                500
            )
        })
    }

    // termapplication info:
    async fetchApp() {
        axios.get(this.get_term_url)
            .then((res) => {
                var newState = res.data[0]
                if (!newState) newState = {}
                for (const [k, v] of Object.entries(this.DEFAULT_VALUES)) {
                    if (!newState[k]) newState[k] = v
                }
                this.setState(newState)
            })
    }

    // application info:
    async fetchCourses() {
        return axios.get(this.get_courses_url)
            .then((res) => {
                return res.data
            })
    }
    async fetchRefusal() {
        return axios.get(this.get_refusal_url)
            .then((res) => {
                return res.data
            })
    }
    makeTable(courseData, refusalInfo) {
        for (const [key, course] of Object.entries(courseData)) {
            const courseId = course.code
            for (const right of refusalInfo) {
                if (right.course === courseId) {
                    courseData[key].rightOfRefusal = 1
                }
            }
        }
        var courseTable = []
        var refusalTable = []
        for (const [key, item] of Object.entries(courseData)) {
            const appItem = <Application data={item} term={this.state.term} rowKey={key} key={key} />
            if (item.rightOfRefusal) {
                refusalTable.push(appItem)
            } else {
                courseTable.push(appItem)
            }
        }
        var newState = this.state
        newState.refusalTable = refusalTable
        newState.courseTable = courseTable
        this.setState(newState)
    }

    render() {
        return (
            <>
                <div className="application">
                    <h2>
                        TA Application for {this.state ? this.state.termname : 'Loading...'}
                    </h2>
                    <form className="form">
                        <p>
                            Your changes are saved automatically. You can unsubmit later.
                        </p>

                        <h3>General Info</h3>
                        <div className="form-row">
                            <label>
                                <input type="checkbox" checked={this.state.wantstoteach} onChange={(event) => this.handleChange('wantstoteach', event)} />
                                I want to be a teaching assistant this semester
                            </label>
                        </div>
                        <div className="form-row">
                            Load availability in quarter-loads (1-4) (Tooltip here):
                            <TextField
                                type="number"
                                value={this.state.availability}
                                onChange={event => this.handleChange('availability', event)}
                                InputProps={{
                                    inputProps: {
                                        max: 4, min: 1
                                    }
                                }}
                            />
                            {/* <input type="number" min={0} max={20} value={this.state.availability} onChange={(event) => this.handleChange('availability', event)} /> */}
                        </div>

                        {/* <div className="form-row">
                            <label>
                                <input type="checkbox" checked={this.state.approval} onChange={(event) => this.handleChange('approval', event)} />
                                I have my advisor's / supervisor's approval (Leave blank if not a grad student)
                            </label>
                        </div> */}
                        {/* <div className="form-row">
                            <label>
                                <input type="checkbox" checked={this.state.incanada} onChange={(event) => this.handleChange('incanada', event)} />
                                I will be able to attend the required lab sessions in person this semester
                            </label>
                        </div> */}

                        <div>
                            {this.state.refusalTable && this.state.refusalTable.length ?
                                <>
                                    <div className="priority-course-div">
                                        <h3>Priority Courses</h3>
                                        <HtmlTooltip title={
                                            <>
                                                {"You have priority for these courses because you were a TA for them in the previous term."}
                                            </>
                                        }>
                                            <IconButton
                                                variant="contained"
                                                size="small"
                                                sx={{ height: 30, width: 30 }}
                                            >
                                                ?
                                            </IconButton>
                                        </HtmlTooltip>
                                    </div>
                                    <TableContainer>
                                        <Table size="small" >
                                            <TableHead>
                                                <TableRow>
                                                    <th>Course</th>
                                                    <th>Title</th>
                                                    {/* <th>Grade</th> */}
                                                    <th>Interest</th>
                                                    <th>Qualification</th>
                                                    <th></th>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {!this.state.refusalTable ? <tr><td>loading...</td></tr> : this.state.refusalTable}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </>
                                :
                                <></>
                            }

                        </div>
                        <div>
                            <h3>Course Preferences</h3>
                            <TableContainer >
                                <Table size="small" >
                                    <TableHead>
                                        <TableRow>
                                            <th>Course</th>
                                            <th>Title</th>
                                            {/* <th>Grade</th> */}
                                            <th>Interest</th>
                                            <th>Qualification</th>
                                            <th></th>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {!this.state.courseTable ? <tr><td>loading...</td></tr> : this.state.courseTable}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                        <div className="form-row">
                            Provide a brief explanation of which courses you want to TA for, and your relevant experience
                            <br />
                            <textarea value={this.state.explanation} onChange={(event) => this.handleChange('explanation', event)} />
                        </div>
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