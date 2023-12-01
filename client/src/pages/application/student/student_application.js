import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import HtmlTooltip from "../../components/tooltip";
import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";
import DatagridTable from "../../components/datagrid/datagrid_table";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { GridColDef } from "@mui/x-data-grid";
import renderGridCellTooltip from "../../components/datagrid/render_tooltip";
import renderGridCellRatingInput from "../../components/datagrid/render_rating_input";

// const GET_TERM_APP = '/api/applicant/termapplication/'
const GET_TERM_APP2 = "/api/applicant/applications/available/";
const GET_COURSE_APPS = "/api/applicant/applications/";
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
// const rows = [
//     { codename: '2030', course: 'intro oop', description: 'desc', interest: 3, qualification: 3 },
// ]

const StudentApplication = () => {
  const [termApp, setTermApp] = useState({});
  const [appRows, setAppRows] = useState([]);
  const params = useParams();

  useEffect(() => {
    async function fetchTerm() {
      // const url = GET_TERM_APP + params.term
      const url = GET_TERM_APP2;
      const res = await axios.get(url);
      const data = res.data.filter((el) => {
        return parseInt(el.term) === parseInt(params.term);
      });
      setTermApp(data[0]);
    }
    async function fetchApps() {
      const url = GET_COURSE_APPS + params.term;
      const res = await axios.get(url);
      setAppRows(res.data);
    }
    fetchTerm();
    fetchApps();
  }, [params]);

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
      interest: newRow.interest ?? 1,
      qualification: newRow.qualification ?? 1,
    };
    axios.post(POST_COURSE_APPS, body);
    return newRow;
  }

  useEffect(() => {
    const postData = setTimeout(() => {
      if (!!termApp && Object.keys(termApp).length !== 0) {
        axios.post(POST_TERM_APP, termApp); //.then(res => console.log(res.data[0]))
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(postData);
  }, [termApp]);

  return (
    <div className="application">
      <h2>Teaching Assistant Application for {termApp?.termname}</h2>
      <p>
        Your changes are saved automatically. Unsubmitting will withdraw your
        application.
      </p>
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
        <ul>
          <li>
            <renderGridCellRatingInput readonly="true" value="1" /> Not
            Interested
          </li>
        </ul>
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

      <p></p>
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
