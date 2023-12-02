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
    headerName: "Availability (quarter loads)",
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
            Note that this list is provided to gather your general interests.
            Assignments will take into account your preferences, but rules set
            by the University and the collective agreement, such as seniority
            and right of first refusal, may take precedence in assignment
            decisions. You are strongly encouraged to make notes on as many
            applicants as possible.
          </p>
          <p>
            Please be cognisant that information provided here may be subject to
            Freedom of Information requests. If there are performance concerns
            that require escalation, grievance or similar concerns, please
            contact the TA assignment coordinator directly, so that appropriate
            action may be considered.
          </p>
          <details open>
            <summary>Legend for Interest and Qualification columns</summary>
            <ul>
              <li>
                <Rating
                  icon={<CircleIcon />}
                  emptyIcon={<CircleOutlinedIcon />}
                  readOnly
                  value={5}
                />
                <Box sx={{ ml: 2 }}>Preferred option</Box>
              </li>
              <li>
                <Rating
                  icon={<CircleIcon />}
                  emptyIcon={<CircleOutlinedIcon />}
                  readOnly
                  value={4}
                />
                <Box sx={{ ml: 2 }}>Strong option</Box>
              </li>
              <li>
                <Rating
                  icon={<CircleIcon />}
                  emptyIcon={<CircleOutlinedIcon />}
                  readOnly
                  value={3}
                />
                <Box sx={{ ml: 2 }}>Good option</Box>
              </li>
              <li>
                <Rating
                  icon={<CircleIcon />}
                  emptyIcon={<CircleOutlinedIcon />}
                  readOnly
                  value={2}
                />
                <Box sx={{ ml: 2 }}>Weak option</Box>
              </li>
              <li>
                <Rating
                  icon={<CircleIcon />}
                  emptyIcon={<CircleOutlinedIcon />}
                  readOnly
                  value={1}
                />
                <Box sx={{ ml: 2 }}>Not an option</Box>
              </li>
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
