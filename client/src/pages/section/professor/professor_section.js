import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { GridRowEditStopReasons } from "@mui/x-data-grid";
import DatagridTable from "../../components/datagrid/datagrid_table";
import renderGridCellSelectInput from "../../components/datagrid/render_select_input";
import renderGridCellTextFieldInput from "../../components/datagrid/render_textfield_input";
import renderGridCellTooltip from "../../components/datagrid/render_tooltip";
import renderGridCellRatingInput from "../../components/datagrid/render_rating_input";
import { Alert, Box, Rating } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";

const GET_URL = "/api/instructor/";
const POST_URL = "/api/instructor/assignment";
const ORDERED_LIST = ["no preference", "acceptable", "requested", "critical"];

/** @type {import("@mui/x-data-grid").GridComparatorFn} */
const sortOrder = (v1, v2) => {
  return ORDERED_LIST.indexOf(v1) - ORDERED_LIST.indexOf(v2);
};

/** @type {import("@mui/x-data-grid").GridColDef[]} */
const columns = [
  {
    field: "firstname",
    headerName: "Name",
    width: 150,
    headerClassName: "section-table-header",
  },
  {
    field: "lastname",
    headerName: "Surname",
    width: 150,
    headerClassName: "section-table-header",
  },
  {
    field: "availability",
    headerName: "Availability (QL)",
    width: 150,
    headerClassName: "section-table-header",
  },
  {
    field: "interest",
    headerName: "Interest",
    width: 150,
    headerClassName: "section-table-header",
    renderCell: (p) => renderGridCellRatingInput(p, true),
  },
  {
    field: "qualification",
    headerName: "Qualification",
    width: 150,
    headerClassName: "section-table-header",
    renderCell: (p) => renderGridCellRatingInput(p, true),
  },
  {
    field: "explanation",
    headerName: "Details",
    width: 100,
    renderCell: renderGridCellTooltip,
    headerClassName: "section-table-header",
    sortable: false,
  },
  {
    field: "pref",
    headerName: "Preference",
    width: 180,
    editable: true,
    renderEditCell: renderGridCellSelectInput,
    renderCell: renderGridCellSelectInput,
    align: "left",
    headerAlign: "left",
    headerClassName: "section-table-header",
    sortComparator: sortOrder,
  },
  {
    field: "note",
    headerName: "Note",
    width: 300,
    editable: true,
    renderEditCell: renderGridCellTextFieldInput,
    renderCell: renderGridCellTextFieldInput,
    headerClassName: "section-table-header",
  },
];

// const loadingRows = [
//     { userid: -1, firstname: 'Loading...' },
// ]

const ProfessorSection = () => {
  const { sectionId } = useParams();
  const [tableData, setTableData] = useState(null);
  // const [rowSelectionModel, setRowSelectionModel] = useState([])

  useEffect(() => {
    const url = GET_URL + sectionId;
    axios.get(url).then((res) => {
      var dataObj = {};
      res.data.forEach((element, idx) => {
        element.pref = element.pref ?? "no preference";
        element.note = element.note ?? "";
        if (!dataObj[element.pool]) dataObj[element.pool] = [];
        dataObj[element.pool].push(element);
        return element;
      });
      setTableData(dataObj);
    });
  }, [sectionId]);

  const onEditStop = useCallback((params, event, details) => {
    if (params.reason === GridRowEditStopReasons.enterKeyDown) {
      event.defaultMuiPrevented = true;
      return;
    }
  }, []);

  const processRowUpdate = useCallback(
    async (newRow, oldRow) => {
      // console.log(newRow, oldRow)
      if (JSON.stringify(oldRow) === JSON.stringify(newRow)) return newRow;
      const body = {
        pref: newRow.pref,
        note: newRow.note,
        studentNum: newRow.userid,
        sectionId: sectionId,
      };
      // const res =
      await axios.post(POST_URL, body);
      // console.log(res)
      return newRow;
    },
    [sectionId]
  );

  return (
    <>
      <div className="section">
        <Alert severity="info">
          <p>
            Note that this list is provided to gather your preferences on
            applicants. Assignments will take into account your preferences, but
            rules set by the University and the collective agreement, such as
            seniority and right of first refusal, may take precedence in
            assignment decisions. You are strongly encouraged to make notes on
            as many qualified applicants as you see fit, even if they are not
            tagged as requested.
          </p>
          <p>
            Please be cognisant that information provided here may be subject to
            Freedom of Information requests. If there are performance concerns
            that require escalation, grievance or similar concerns, please
            contact the TA assignment coordinator directly, so that appropriate
            action may be considered.
          </p>
          <p>You may list applicants as:</p>
          <ul>
            <li>
              <strong>Critical</strong>: these are applicants that are
              intimately involved in the development of the course material or
              logistics, and for which the course delivery would be severely
              hindered without that TA. A note explaining the reason for this
              preference is required. Please use with moderation.
            </li>
            <li>
              <strong>Requested</strong>: these are applicants that you would
              like to have assigned to your course, with high confidence.
            </li>
            <li>
              <strong>Acceptable</strong>: these are applicants that would be
              acceptable if the requested TAs are not available.
            </li>
            <li>
              <strong>No preference</strong>: this rating is for applicants that
              don't provide information for you to consider a request. They may
              still be assigned to the course in case of rules of seniority,
              right of first refusal or funding requirements, but will not be
              assigned if a better option is available and suitable.
            </li>
          </ul>
          <details open>
            <summary>Legend for Interest and Qualification columns</summary>
            <ul>
              {[
                [5, "Preferred Option"],
                [4, "Strong Option"],
                [3, "Good Option"],
                [2, "Weak Option"],
                [1, "Not an Option"],
              ].map(([val, label]) => (
                <li>
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
        {tableData &&
          Object.keys(tableData).map((key, idx) => (
            <div key={key}>
              <h2>{key.toUpperCase()} Applicants</h2>
              <DatagridTable
                key={key}
                idVarName={"userid"}
                rows={tableData[key]}
                columns={columns}
                loading={!tableData}
                onEditStop={onEditStop}
                processRowUpdate={processRowUpdate}
                rowHeight={40}
              />
            </div>
          ))}
      </div>
    </>
  );
};

export default ProfessorSection;
