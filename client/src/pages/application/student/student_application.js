import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormGroup,
  Rating,
  TextField,
} from "@mui/material";
import DatagridTable from "../../components/datagrid/datagrid_table";
import renderGridCellTooltip from "../../components/datagrid/render_tooltip";
import renderGridCellRatingInput from "../../components/datagrid/render_rating_input";
import CircleIcon from "@mui/icons-material/Circle";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import { wget, wpost } from "../../requestWrapper";

// const GET_TERM_APP = '/api/applicant/termapplication/'
const GET_TERM_APP2 = "/api/applicant/applications/available/";
const GET_COURSE_APPS = "/api/applicant/applications/";
const GET_RECENT_TERM_APP = "/api/applicant/termapplication/recent/";
const GET_RECENT_COURSE_APPS = "/api/applicant/application/recent/";
const POST_TERM_APP = "/api/applicant/termapplication/";
const POST_COURSE_APPS = "/api/applicant/application/";

const MAX_AVAILABILITY = 4;
const MIN_AVAILABILITY = 0;
const DEBOUNCE_MS = 400;

/** @type {GridColDef[]} */
const columns = [
  {
    field: "codename",
    headerName: "Course",
    width: 150,
    headerClassName: "section-table-header",
  },
  {
    field: "name",
    headerName: "Title",
    width: 150,
    headerClassName: "section-table-header",
    flex: 1,
  },
  {
    field: "description",
    headerName: "Description",
    width: 120,
    headerClassName: "section-table-header",
    renderCell: renderGridCellTooltip,
  },
  {
    field: "interest",
    headerName: "Interest",
    width: 150,
    headerClassName: "section-table-header",
    editable: true,
    renderCell: renderGridCellRatingInput,
    renderEditCell: renderGridCellRatingInput,
  },
  {
    field: "qualification",
    headerName: "Qualification",
    width: 150,
    headerClassName: "section-table-header",
    editable: true,
    renderCell: renderGridCellRatingInput,
    renderEditCell: renderGridCellRatingInput,
  },
];

const StudentApplication = () => {
  const [termApp, setTermApp] = useState({});
  const [appRows, setAppRows] = useState([]);
  const params = useParams();
  const nav = useNavigate();

  useEffect(() => {
    async function fetchTerm() {
      // const url = GET_TERM_APP + params.term
      const url = GET_TERM_APP2;
      const res = await wget(nav, url);
      const data = res.data.filter((el) => {
        return parseInt(el.term) === parseInt(params.term);
      });
      // if(data === null) {data = await pullAvail()}
      setTermApp(data[0]);
    }
    async function fetchApps() {
      const url = GET_COURSE_APPS + params.term;
      const res = await wget(nav, url);
      console.log(res.data);
      setAppRows(res.data);
    }
    fetchTerm();
    fetchApps();
  }, [params, nav]);

  function handleChange(event) {
    // Checkboxes use "checked" instead of "value" field in event.target
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setTermApp((old) => {
      return { ...old, [event.target.name]: value };
    });
  }

  async function updateRow(newRow, oldRow) {
    if (JSON.stringify(oldRow) === JSON.stringify(newRow)) return newRow;

    const body = {
      course: newRow.code,
      term: params.term,
      interest: newRow.interest ?? 2,
      qualification: newRow.qualification ?? 2,
    };
    try {
      await wpost(nav, POST_COURSE_APPS, body);
    } catch (err) {
      return oldRow;
    }
    return newRow;
  }

  async function pullAvail() {
    // console.log(termApp);
    const url = GET_RECENT_TERM_APP + params.term;
    // console.log(url);
    const res = await wget(nav, url);
    // console.log(res.data);
    setTermApp((old) => {
      return {
        ...old,
        availability: res.data?.availability,
        explanation: res.data?.explanation,
      };
    });
  }

  async function pullCoursePrefs() {
    console.log(appRows);
    const url = GET_RECENT_COURSE_APPS + params.term;
    const res = await wget(nav, url);
    console.log(res.data);
  }

  useEffect(() => {
    const postData = setTimeout(() => {
      if (!!termApp && Object.keys(termApp).length !== 0) {
        wpost(nav, POST_TERM_APP, termApp); //.then(res => console.log(res.data[0]))
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(postData);
  }, [termApp, nav]);

  return (
    <div className="application">
      <h2>Teaching Assistant Application for {termApp?.termname}</h2>
      <p>
        Your changes are saved automatically. Unsubmitting will withdraw your
        application.
      </p>
      <h3>Push forward old applications</h3>
      <p>
        If you have previous applications, you can bring those details to this
        one. <strong>Any existing changes will be overwritten!</strong>
      </p>
      <Button variant="contained" onClick={pullAvail}>
        Availability and experience
      </Button>
      <Button variant="contained" color="secondary" onClick={pullCoursePrefs}>
        Course preferences
      </Button>
      <h3>Availability</h3>
      <FormGroup>
        <TextField
          value={termApp?.availability ?? 0}
          name="availability"
          onChange={handleChange}
          label="Availability (quarter loads)"
          type="number"
          InputProps={{
            inputProps: {
              max: MAX_AVAILABILITY,
              min: MIN_AVAILABILITY,
            },
          }}
          sx={{ marginRight: "10px" }}
          FormHelperTextProps={{ component: "div" }}
          helperText={
            <div>
              <p>
                Please provide your availability for the term. A quarter load is
                33.75 hours over the course of a term. A full load is 135 hours.
                If you are not available for a TA position this coming term,
                please set the value to zero.
              </p>
              <p>
                <strong>For unit 1 TAs</strong>: selecting a load below your
                expected funding level, as determined by your supervisor, may
                affect your funding. If you are unsure what your funding level
                is, please set this value to 4 and your load will be limited
                accordingly.
              </p>
            </div>
          }
        />
      </FormGroup>
      <h3>Course Preferences</h3>
      <Alert severity="info">
        <p>
          Note that this list is provided to gather your general interests.
          There is no guarantee that all these courses will hire TAs, and there
          is no guarantee we will be able to provide you with your first
          choices. so you are strongly encouraged to list as many courses as
          possible, preferably including all courses you qualify for.
        </p>
        <details open>
          <summary>Legend for Interest and Qualification columns</summary>
          <ul>
            {[
              [
                5,
                <>
                  <strong>Preferred option</strong>, very interested and
                  qualified. This is the assignment that you are most excited
                  about and confident in your ability to perform well. You have
                  the relevant skills, experience and knowledge to meet the
                  expectations and requirements of the assignment. You would
                  accept an offer for this assignment without hesitation.
                </>,
              ],
              [
                4,
                <>
                  <strong>Strong option</strong>, interested and qualified. This
                  is an assignment that you are enthusiastic about and capable
                  of doing well. You have most of the skills, experience and
                  knowledge needed for the assignment, or you are willing to
                  learn them quickly. You would accept an offer for this
                  assignment.
                </>,
              ],
              [
                3,
                <>
                  <strong>Good option</strong>, somewhat interested and
                  qualified. This is an assignment that you are curious about
                  and competent in doing. You have some of the skills,
                  experience and knowledge required for the assignment, or you
                  are open to acquiring them. You would accept an offer for this
                  assignment if options with higher preference are not
                  available.
                </>,
              ],
              [
                2,
                <>
                  <strong>Weak option</strong>, not very interested or
                  qualified. This is an assignment that you are indifferent
                  about or unsure of your ability to do well. You have few of
                  the skills, experience and knowledge necessary for the
                  assignment, or you are reluctant to learn them. You would
                  accept an offer for this assignment provided there are no
                  better options available.
                </>,
              ],
              [
                1,
                <>
                  <strong>Not an option</strong>, not interested at all, will
                  not accept an offer for it. This is an assignment that you are
                  not interested in or confident in your ability to do well. You
                  have none of the skills, experience or knowledge relevant for
                  the assignment, or you are opposed to learning them. You would
                  reject an offer for this assignment regardless of the
                  situation.
                  <em>Unit 1 applicants</em>: note that choosing this option may
                  affect your funding if none of the other courses you are
                  qualified have availability.
                </>,
              ],
            ].map(([val, label]) => (
              <li key={val}>
                <Box sx={{ display: "flex" }}>
                  <Rating
                    icon={<CircleIcon />}
                    emptyIcon={<CircleOutlinedIcon />}
                    readOnly
                    value={val}
                  />
                  <Box sx={{ ml: 2 }}>{label}</Box>
                </Box>
              </li>
            ))}
          </ul>
        </details>
      </Alert>
      <DatagridTable
        columns={columns}
        idVarName={"code"}
        loading={!appRows}
        onEditStop={null}
        processRowUpdate={updateRow}
        rows={appRows ?? []}
        rowHeight={40}
      />

      <p />
      <TextField
        value={termApp?.explanation ?? ""}
        onChange={handleChange}
        name="explanation"
        label="Relevant Experience"
        fullWidth
        multiline
        inputProps={{ maxLength: 1000 }}
        helperText="Please provide a brief explanation of your relevant experience in the courses you listed above. This will be used to help us assign you to a course. Include any information that is relevant, including TA experience, programming languages, relevant tools, and other experience that applies directly to your suitability for the course."
      />
      <p />
      <Button
        onClick={() =>
          handleChange({
            target: { value: !termApp.submitted, name: "submitted" },
          })
        }
        variant="contained"
      >
        {termApp?.submitted ? "Unsubmit" : "Submit"}
      </Button>
      {termApp?.submitted && (
        <Alert severity="success">Application is submitted</Alert>
      )}
    </div>
  );
};

export default StudentApplication;
