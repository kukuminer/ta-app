import { useParams } from "react-router-dom"
import React, { useEffect, useState } from "react"
import axios from "axios"
import HtmlTooltip from "../../components/tooltip"
import { Button, Checkbox, FormControlLabel, FormGroup, TextField } from "@mui/material"
import DatagridTable from "../../components/datagrid/datagrid_table"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import { GridColDef } from "@mui/x-data-grid"
import renderGridCellTooltip from "../../components/datagrid/render_tooltip"
import renderGridCellRatingInput from "../../components/datagrid/render_rating_input"

// const GET_TERM_APP = '/api/applicant/termapplication/'
const GET_TERM_APP2 = '/api/applicant/applications/available/'
const GET_COURSE_APPS = '/api/applicant/applications/'
const POST_TERM_APP = '/api/applicant/termapplication/'
const POST_COURSE_APPS = '/api/applicant/application/'

const MAX_AVAILABILITY = 4
const MIN_AVAILABILITY = 0
const DEBOUNCE_MS = 400

const columns: GridColDef[] = [
    { field: 'codename', headerName: 'Course', width: 150, headerClassName: 'section-table-header' },
    { field: 'name', headerName: 'Title', width: 150, headerClassName: 'section-table-header', flex: 1 },
    {
        field: 'description',
        headerName: 'Description',
        width: 120,
        headerClassName: 'section-table-header',
        renderCell: renderGridCellTooltip,
    },
    {
        field: 'interest',
        headerName: 'Interest',
        width: 150,
        headerClassName: 'section-table-header',
        editable: true,
        renderCell: renderGridCellRatingInput,
        renderEditCell: renderGridCellRatingInput,
    },
    {
        field: 'qualification',
        headerName: 'Qualification',
        width: 150,
        headerClassName: 'section-table-header',
        editable: true,
        renderCell: renderGridCellRatingInput,
        renderEditCell: renderGridCellRatingInput,
    },
]
// const rows = [
//     { codename: '2030', course: 'intro oop', description: 'desc', interest: 3, qualification: 3 },
// ]

const StudentApplication = () => {
    const [termApp, setTermApp] = useState({})
    const [appRows, setAppRows] = useState([])
    const params = useParams()

    useEffect(() => {
        async function fetchTerm() {
            // const url = GET_TERM_APP + params.term
            const url = GET_TERM_APP2
            const res = await axios.get(url)
            const data = res.data.filter((el) => {
                return parseInt(el.term) === parseInt(params.term)
            })
            setTermApp(data[0])
        }
        async function fetchApps() {
            const url = GET_COURSE_APPS + params.term
            const res = await axios.get(url)
            setAppRows(res.data)
        }
        fetchTerm()
        fetchApps()
    }, [params])

    function handleChange(event) {
        // Checkboxes use "checked" instead of "value" field in event.target
        const value = event.target.type === "checkbox" ? event.target.checked : event.target.value
        setTermApp(old => {
            return { ...old, [event.target.name]: value }
        })
    }

    async function updateRow(newRow, oldRow) {
        if (JSON.stringify(oldRow) === JSON.stringify(newRow)) return newRow

        const body = {
            course: newRow.code,
            term: params.term,
            interest: newRow.interest ?? 1,
            qualification: newRow.qualification ?? 1,
        }
        console.log(body)
        axios.post(POST_COURSE_APPS, body)
        return newRow
    }

    useEffect(() => {
        const postData = setTimeout(() => {
            if (!!termApp && Object.keys(termApp).length !== 0) {
                console.log(termApp)
                axios.post(POST_TERM_APP, termApp)//.then(res => console.log(res.data[0]))
            }
        }, DEBOUNCE_MS)
        return () => clearTimeout(postData)
    }, [termApp])

    return <div className="application">
        <h2>Teaching Assistant Application for {termApp?.termname}</h2>
        {termApp?.submitted && <h2>Application is submitted</h2>}
        <p>Your changes are saved automatically. Unsubmitting will withdraw your application.</p>
        <h3>General Info</h3>
        <FormGroup>
            <FormControlLabel
                control={<Checkbox
                    checked={termApp?.wantstoteach ?? false}
                    // onChange={(e) => handleChange('wantstoteach', !e.target.checked)}
                    name="wantstoteach"
                    onChange={handleChange}
                />}
                label="I want to be a teaching assistant this semester"
            />
            <FormControlLabel
                control={<TextField
                    value={termApp?.availability ?? 0}
                    name="availability"
                    onChange={handleChange}
                    type="number"
                    InputProps={{
                        inputProps: {
                            max: MAX_AVAILABILITY, min: MIN_AVAILABILITY
                        }
                    }}
                    sx={{ marginRight: '10px' }}
                />}
                label={<>
                    Load availability in quarter-loads (0-4)
                    <HtmlTooltip title={
                        <>
                            {"Each quarter load is 33.75 hours over the course of the semester."}
                        </>
                    }>
                        <InfoOutlinedIcon />
                    </HtmlTooltip>
                </>}
            >
            </FormControlLabel>

        </FormGroup>
        <h3>Course Preferences</h3>

        <DatagridTable
            columns={columns}
            idVarName={'code'}
            loading={!appRows}
            onEditStop={null}
            processRowUpdate={updateRow}
            rows={appRows ?? []}
            rowHeight={60}
        />

        <p>
            Provide a brief explanation of which courses you want to TA for, and your relevant experience (Maximum 1000 characters)
        </p>
        <TextField
            value={termApp?.explanation ?? ''}
            onChange={handleChange}
            name="explanation"
            fullWidth
            multiline
            inputProps={{ maxLength: 1000 }}
        />
        <p />
        <Button
            onClick={() => handleChange({ target: { value: !termApp.submitted, name: 'submitted' } })}
            variant="contained"
        >
            {termApp?.submitted ? 'Unsubmit' : 'Submit'}
        </Button>
    </div>
    // return <StudentApplicationClass state={location.state} />
}

// class StudentApplicationClass extends React.Component {
//     POST_URL = '/api/applicant/termapplication'
//     DEFAULT_VALUES = {
//         approval: false,
//         availability: 0,
//         explanation: '',
//         incanada: false,
//         wantstoteach: false,
//         submitted: false,
//     }
//     TIMER = null
//     MAX_AVAILABILITY = 4
//     MIN_AVAILABILITY = 0

//     constructor(props) {
//         super(props)
//         this.state = {}
//         this.state.term = props.state.term
//         this.state.termname = props.state.termname
//         this.state.userId = getUser()

//         // Initialize state to default values if it is null:
//         for (const [k, v] of Object.entries(this.DEFAULT_VALUES)) {
//             if (!this.state[k]) this.state[k] = v
//         }
//         console.log(this.state)

//         this.get_courses_url = '/api/applicant/applications/' + this.state.term
//         this.get_term_url = '/api/applicant/termapplication/' + this.state.term
//         this.get_refusal_url = '/api/applicant/refusal/' + this.state.term
//         this.courseData = []
//     }
//     componentDidMount() {
//         this.fetchApp()
//         this.fetchCourses().then(this.fetchRefusal())
//         Promise.all([this.fetchCourses(), this.fetchRefusal()]).then((vals) =>
//             this.makeTable(vals[0], vals[1])
//         )

//     }
//     componentWillUnmount() {
//         clearTimeout(this.TIMER)
//     }

//     handleChange = (changedKey, event) => {
//         // this.state[changedKey] = event.target.value
//         const stateCopy = this.state
//         if (event.target.type === "checkbox") {
//             stateCopy[changedKey] = event.target.checked
//         }
//         else if (changedKey === 'submitted') {
//             stateCopy[changedKey] = !this.state.submitted
//         }
//         else if (changedKey === 'availability') {
//             var val = event.target.value ? parseInt(event.target.value) : 0
//             stateCopy[changedKey] = Math.max(this.MIN_AVAILABILITY, Math.min(this.MAX_AVAILABILITY, val))
//         }
//         else {
//             stateCopy[changedKey] = event.target.value
//         }
//         this.setState(stateCopy, () => {
//             const body = {
//                 userId: this.state.userId,
//                 term: this.state.term,
//                 submitted: this.state.submitted,
//                 availability: this.state.availability,
//                 approval: this.state.approval,
//                 explanation: this.state.explanation,
//                 incanada: this.state.incanada,
//                 wantstoteach: this.state.wantstoteach,
//             }
//             clearTimeout(this.TIMER)
//             this.TIMER = setTimeout(
//                 function () {
//                     axios.post(this.POST_URL, body)
//                         .then((res) => {
//                             this.setState({
//                                 submitted: res.data[0].submitted,
//                                 availability: res.data[0].availability,
//                                 approval: res.data[0].approval,
//                                 explanation: res.data[0].explanation,
//                                 incanada: res.data[0].incanada,
//                                 wantstoteach: res.data[0].wantstoteach,
//                             })
//                             console.log(this.state)
//                         })
//                         .catch((error) => {
//                             console.log('frontend error posting interest/qual changes:', error)
//                         })
//                     return () => clearTimeout(this.TIMER)
//                 }.bind(this),
//                 500
//             )
//         })
//     }

//     // termapplication info:
//     async fetchApp() {
//         axios.get(this.get_term_url)
//             .then((res) => {
//                 var newState = res.data[0]
//                 if (!newState) newState = {}
//                 for (const [k, v] of Object.entries(this.DEFAULT_VALUES)) {
//                     if (!newState[k]) newState[k] = v
//                 }
//                 this.setState(newState)
//             })
//     }

//     // application info:
//     async fetchCourses() {
//         return axios.get(this.get_courses_url)
//             .then((res) => {
//                 return res.data
//             })
//     }
//     async fetchRefusal() {
//         return axios.get(this.get_refusal_url)
//             .then((res) => {
//                 return res.data
//             })
//     }
//     makeTable(courseData, refusalInfo) {
//         console.log(courseData)
//         console.log(refusalInfo)
//         for (const [key, course] of Object.entries(courseData)) {
//             const courseId = course.code
//             for (const right of refusalInfo) {
//                 if (right.course === courseId) {
//                     courseData[key].rightOfRefusal = 1
//                 }
//             }
//         }
//         var courseTable = []
//         var refusalTable = []
//         for (const [key, item] of Object.entries(courseData)) {
//             const appItem = <Application data={item} term={this.state.term} rowKey={key} key={key} />
//             if (item.rightOfRefusal) {
//                 refusalTable.push(appItem)
//             } else {
//                 courseTable.push(appItem)
//             }
//         }
//         var newState = this.state
//         newState.refusalTable = refusalTable
//         newState.courseTable = courseTable
//         this.setState(newState)
//     }

//     render() {
//         return (
//             <>
//                 <div className="application">
//                     <h2>
//                         TA Application for {this.state ? this.state.termname : 'Loading...'}
//                     </h2>
//                     <form className="form">
//                         <p>
//                             Your changes are saved automatically. You can unsubmit later.
//                         </p>

//                         <h3>General Info</h3>
//                         <div className="form-row">
//                             <label>
//                                 <input type="checkbox" checked={this.state.wantstoteach} onChange={(event) => this.handleChange('wantstoteach', event)} />
//                                 I want to be a teaching assistant this semester
//                             </label>
//                         </div>
//                         <div className="form-row">
//                             Load availability in quarter-loads ({this.MIN_AVAILABILITY}-{this.MAX_AVAILABILITY}) (Tooltip here):
//                             <TextField
//                                 type="number"
//                                 value={this.state.availability}
//                                 onChange={event => this.handleChange('availability', event)}
//                                 InputProps={{
//                                     inputProps: {
//                                         max: this.MAX_AVAILABILITY, min: this.MIN_AVAILABILITY
//                                     }
//                                 }}
//                             />
//                             {/* <input type="number" min={0} max={20} value={this.state.availability} onChange={(event) => this.handleChange('availability', event)} /> */}
//                         </div>

//                         {/* <div className="form-row">
//                             <label>
//                                 <input type="checkbox" checked={this.state.approval} onChange={(event) => this.handleChange('approval', event)} />
//                                 I have my advisor's / supervisor's approval (Leave blank if not a grad student)
//                             </label>
//                         </div> */}
//                         {/* <div className="form-row">
//                             <label>
//                                 <input type="checkbox" checked={this.state.incanada} onChange={(event) => this.handleChange('incanada', event)} />
//                                 I will be able to attend the required lab sessions in person this semester
//                             </label>
//                         </div> */}

//                         <div>
//                             {this.state.refusalTable && this.state.refusalTable.length ?
//                                 <>
//                                     <div className="priority-course-div">
//                                         <h3>Priority Courses</h3>
//                                         <HtmlTooltip title={
//                                             <>
//                                                 {"You have priority for these courses because you were a TA for them in the previous term."}
//                                             </>
//                                         }>
//                                             <IconButton
//                                                 variant="contained"
//                                                 size="small"
//                                                 sx={{ height: 30, width: 30 }}
//                                             >
//                                                 ?
//                                             </IconButton>
//                                         </HtmlTooltip>
//                                     </div>
//                                     <TableContainer>
//                                         <Table size="small" >
//                                             <TableHead>
//                                                 <TableRow>
//                                                     <th>Course</th>
//                                                     <th>Title</th>
//                                                     <th>Description</th>
//                                                     <th>Interest</th>
//                                                     <th>Qualification</th>
//                                                     <th></th>
//                                                 </TableRow>
//                                             </TableHead>
//                                             <TableBody>
//                                                 {!this.state.refusalTable ? <tr><td>loading...</td></tr> : this.state.refusalTable}
//                                             </TableBody>
//                                         </Table>
//                                     </TableContainer>
//                                 </>
//                                 :
//                                 <></>
//                             }

//                         </div>
//                         <div>
//                             <h3>Course Preferences</h3>
//                             <DatagridTable
//                                 columns={columns}
//                                 idVarName={'codename'}
//                                 loading={false}
//                                 onEditStop={() => console.log('edit stop')}
//                                 processRowUpdate={() => console.log('row update')}
//                                 rows={rows}
//                             />
//                             {/* <TableContainer >
//                                 <Table size="small" >
//                                     <TableHead>
//                                         <TableRow>
//                                             <th>Course</th>
//                                             <th>Title</th>
//                                             <th>Description</th>
//                                             <th>Interest</th>
//                                             <th>Qualification</th>
//                                             <th></th>
//                                         </TableRow>
//                                     </TableHead>
//                                     <TableBody>
//                                         {!this.state.courseTable ? <tr><td>loading...</td></tr> : this.state.courseTable}
//                                     </TableBody>
//                                 </Table>
//                             </TableContainer> */}
//                         </div>
//                         <div className="form-row">
//                             Provide a brief explanation of which courses you want to TA for, and your relevant experience
//                             <br />
//                             <TextField
//                                 value={this.state.explanation}
//                                 onChange={(event) => this.handleChange('explanation', event)}
//                                 multiline
//                                 fullWidth
//                             />
//                         </div>
//                         <Button variant="contained"
//                             size="large"
//                             onClick={(event) => this.handleChange('submitted', event)}
//                         >
//                             {this.state.submitted ? 'Unsubmit' : 'Submit'}
//                         </Button>
//                     </form>
//                 </div>
//             </>
//         )
//     }
// }

export default StudentApplication