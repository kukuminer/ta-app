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
        axios.post(POST_COURSE_APPS, body)
        return newRow
    }

    useEffect(() => {
        const postData = setTimeout(() => {
            if (!!termApp && Object.keys(termApp).length !== 0) {
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
}

export default StudentApplication