import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Radio,
  RadioGroup,
  Rating,
  Select,
  TextField,
} from "@mui/material";
import DatagridTable from "../../components/datagrid/datagrid_table";
import renderGridCellTooltip from "../../components/datagrid/render_tooltip";
import renderGridCellRatingInput from "../../components/datagrid/render_rating_input";
import CircleIcon from "@mui/icons-material/Circle";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import { wget, wpost } from "../../requestWrapper";
import NotFound from "../../404";

// const GET_TERM_APP = '/api/applicant/termapplication/'
const GET_TERM_APP2 = "/api/applicant/termapplications/";
const GET_COURSE_APPS = "/api/applicant/applications/";
const POST_TERM_APP = "/api/applicant/termapplication/";
const POST_COURSE_APPS = "/api/applicant/application/";
const CHECK_NEW_TERM = "/api/applicant/term/new/";

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
  const [termApp, setTermApp] = useState({ loading: true });
  const [appRows, setAppRows] = useState([]);
  const [displayCupeHint, setDisplayCupeHint] = useState(null);
  const params = useParams();
  const nav = useNavigate();

  useEffect(() => {
    async function checkNewTerm() {
      const url = CHECK_NEW_TERM;
      await wpost(nav, url, { term: params.term });
    }
    async function fetchTerm() {
      // const url = GET_TERM_APP + params.term
      const url = GET_TERM_APP2;
      const res = await wget(nav, url);
      const data = res.data.filter((el) => {
        return parseInt(el.term) === parseInt(params.term);
      });
      setTermApp(data[0] ? { ...data[0], loading: false } : null);
    }
    async function fetchApps() {
      const url = GET_COURSE_APPS + params.term;
      const res = await wget(nav, url);

      setAppRows(Object.groupBy(res.data, ({ campus }) => campus));
    }
    checkNewTerm().then(() => {
      fetchTerm();
      fetchApps();
    });
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
      campus: newRow.campus,
    };
    try {
      await wpost(nav, POST_COURSE_APPS, body);
    } catch (err) {
      return oldRow;
    }
    return newRow;
  }

  useEffect(() => {
    const postData = setTimeout(() => {
      // console.log(termApp);
      if (!!termApp && termApp?.loading === false) {
        wpost(nav, POST_TERM_APP, termApp); //.then(res => console.log(res.data[0]))
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(postData);
  }, [termApp, nav]);

  return termApp?.loading ? (
    <p>Loading...</p>
  ) : termApp === null ? (
    <NotFound />
  ) : (
    <div className="application">
      <h2>Teaching Assistant Preferences for {termApp?.termname}</h2>
      <p>
        Your changes are saved automatically. If you unsubmit, your preferences
        will no longer be considered.
      </p>
      <h3>Application</h3>
      <FormControl>
        {/* <FormLabel id="radio-button-group-label">
          <h3>Application</h3>
        </FormLabel> */}
        <RadioGroup
          name="radio-submitted-cupe-app"
          value={displayCupeHint}
          onChange={(e) => setDisplayCupeHint(e.target.value)}
        >
          <FormControlLabel
            value={0}
            control={<Radio />}
            label={
              <>
                I have submitted an application at the CUPE jobs web page (
                <a
                  href="https://cupejobs.uit.yorku.ca/"
                  target="_blank"
                  rel="noreferrer"
                >
                  https://cupejobs.uit.yorku.ca/
                </a>
                )
              </>
            }
          />
          <FormControlLabel
            value={1}
            control={<Radio />}
            label={
              <>
                I am unable to submit an application at the CUPE jobs web page
              </>
            }
          />
        </RadioGroup>
      </FormControl>
      {"" + displayCupeHint === "1" && (
        <Alert severity="info">
          If you are unable to complete the application on the CUPE jobs web
          page for any reason, please send an email to{" "}
          <a href="mailto:vinguyen@yorku.ca">vinguyen@yorku.ca</a> with your CV
          and a filled out application form
          <ul>
            <li>
              Unit 1 (Full-time graduate students):{" "}
              <a
                href="https://3903.cupe.ca/wp-content/blogs.dir/266/2014/06/blanket-app-unit-1-revised-Oct-2016_FINAL-3.pdf"
                target="_blank"
                rel="noreferrer"
              >
                https://3903.cupe.ca/wp-content/blogs.dir/266/2014/06/blanket-app-unit-1-revised-Oct-2016_FINAL-3.pdf
              </a>
            </li>
            <li>
              Unit 2 (Anyone else):{" "}
              <a
                href="https://3903.cupe.ca/wp-content/blogs.dir/266/2014/06/blanket-app-unit-2-revised-Oct-2016_FINAL-3.pdf"
                target="_blank"
                rel="noreferrer"
              >
                https://3903.cupe.ca/wp-content/blogs.dir/266/2014/06/blanket-app-unit-2-revised-Oct-2016_FINAL-3.pdf
              </a>
            </li>
          </ul>
        </Alert>
      )}
      <h3>Availability</h3>
      {termApp?.funding !== null /* {termApp?.funding !== null && ( */ && (
        <Alert severity="info">
          <b>
            Load required for funding: {termApp?.funding} quarter load
            {termApp?.funding === 1 ? "" : "s"}
          </b>
          <br />
          {termApp?.funding > 0
            ? `This load is based on information provided by your supervisor. In order
        to obtain full funding for the term, you need to be assigned one or more
        TA positions at this load. If this information does not match your
        records, please get in touch with your supervisor. If your availability
        is lower than this value, you are forfeiting part of your funding.`
            : `You are not expected to get a TA position for the coming term, either 
        because you have completed your required funding or because your supervisor 
        is covering your funding for the term. If this information does not match 
        your records, please get in touch with your supervisor.`}
        </Alert>
      )}
      <FormGroup>
        <Select
          onChange={handleChange}
          value={termApp?.availability ?? 0}
          name="availability"
        >
          <MenuItem value={0}>0 (not available)</MenuItem>
          <MenuItem value={1}>1 quarter load (0.25 load, 33.75 hours)</MenuItem>
          <MenuItem value={2}>2 quarter loads (0.5 load, 67.5 hours)</MenuItem>
          <MenuItem value={3}>
            3 quarter loads (0.75 load, 101.25 hours)
          </MenuItem>
          <MenuItem value={4}>4 quarter loads (full load, 135 hours)</MenuItem>
        </Select>
      </FormGroup>
      {/* {console.log(termApp)} */}
      {"" + termApp?.funding !== "0" && "" + termApp?.availability === "0" && (
        <Alert severity="error">
          If you submit an availability of 0, you will not be assigned any TA
          positions this semester!
        </Alert>
      )}
      {/* <h4>In-person availablility</h4> */}
      <FormControl>
        <h4>Please select your in person availability for this term:</h4>
        <RadioGroup
          name="incanada"
          value={termApp?.["incanada"]}
          onChange={handleChange}
        >
          <FormControlLabel
            value={true}
            control={<Radio />}
            label={
              <>
                I am available for in person activities (labs, tutorials,
                invigilation, etc.).
              </>
            }
          />
          <FormControlLabel
            value={false}
            control={<Radio />}
            label={
              <>
                I am only available for online activities (grading, Zoom office
                hours, student forums, etc.).
                <br /> I understand that selecting this option may limit the
                positions I qualify for, and the number of hours I may be
                assigned.
              </>
            }
          />
        </RadioGroup>
      </FormControl>
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
      {Object.keys(appRows)?.map((key) => (
        <div key={key}>
          <h4>{key.charAt(0).toUpperCase() + key.slice(1)} Campus</h4>
          <DatagridTable
            key={key}
            columns={columns}
            idVarName={"code"}
            loading={!appRows}
            onEditStop={null}
            processRowUpdate={updateRow}
            rows={appRows[key] ?? []}
            rowHeight={40}
          />
        </div>
      ))}
      {/* {console.log(appRows)} */}
      {/* <DatagridTable
        columns={columns}
        idVarName={"code"}
        loading={!appRows}
        onEditStop={null}
        processRowUpdate={updateRow}
        rows={appRows ?? []}
        rowHeight={40}
      /> */}
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
      {"" + termApp?.availability === "0" && (
        <Alert severity="warning">
          Your availability is 0. You will not be assigned any TA roles this
          semester!
        </Alert>
      )}
      {termApp?.["incanada"] === null && (
        <Alert severity="error">
          Missing required field: in person availability
        </Alert>
      )}
      <Button
        onClick={() =>
          handleChange({
            target: { value: !termApp.submitted, name: "submitted" },
          })
        }
        variant="contained"
        disabled={termApp?.["incanada"] === null}
      >
        {termApp?.submitted ? "Unsubmit" : "Submit"}
      </Button>
      {termApp?.submitted && (
        <Alert severity="success">Preferences submitted</Alert>
      )}
    </div>
  );
};

export default StudentApplication;
