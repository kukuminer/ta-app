import getUser from "../../../getUser";
import { useEffect } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { wget } from "../../requestWrapper";
import { useNavigate } from "react-router-dom";

const GET_URL = "/api/applicant/profile"; // /userId
const POOL_OPTIONS = [
  <MenuItem key="unit 1" id={"unit 1"} value={"unit 1"}>
    Unit 1 (Full time graduate students at York)
  </MenuItem>,
  <MenuItem key="unit 2" id={"unit 2"} value={"unit 2"}>
    Unit 2 (All other applicants)
  </MenuItem>,
  // <MenuItem key='N/A' value={'none'}>Neither</MenuItem>
];

const DEFAULT_VALS = {
  studentnum: "",
  employeeid: "",
  pool: "unit 2",
};

const StudentProfile = ({ state, updateState }) => {
  const nav = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      // const fetchedState = {}
      const url = GET_URL;
      try {
        const res = await wget(nav, url);
        console.log(res.data);

        updateState({
          ...state,
          ...(res.data ?? DEFAULT_VALS),
          studentfetched: true,
        });
      } catch (error) {
        updateState({ ...state, studentfetched: false });
        console.log("error fetching student data: ", error);
      }
    };

    if (!state.studentfetched) {
      fetchData();
    }
  }, [state, updateState, nav]);

  function handleChange(event) {
    var newState = structuredClone(state);
    // ?? event.target.name to accommodate the Select dropdown
    newState[event.target.id ?? event.target.name] = event.target.value;
    updateState(newState);
  }

  return (
    <>
      <TextField
        id="studentnum"
        value={state?.studentnum ?? DEFAULT_VALS.studentnum}
        error={!state?.studentnum}
        onChange={handleChange}
        label="Student Number (9 digits)"
        margin="normal"
        inputProps={{ inputMode: "numeric", pattern: "[0-9]{9}" }}
        helperText="This field is optional. If provided, it may be used to retrieve your student record, including your funding information (for unit 1 applicants) and your grades in the courses you are applying to TA for. It will not be provided to instructors."
      />
      <TextField
        id="employeeid"
        value={state?.employeeid ?? DEFAULT_VALS.employeeid}
        error={!state?.employeeid}
        onChange={handleChange}
        label="Employee ID (9 digits)"
        margin="normal"
        inputProps={{ inputMode: "numeric", pattern: "[0-9]{9}" }}
        helperText="This field is optional. If provided, it may be used to retrieve your employee record, including your seniority and assignment history. It will not be provided to instructors."
      />
      <FormControl margin="normal">
        <InputLabel id="pool-select">TA Unit</InputLabel>
        <Select
          labelId="pool-select"
          id="pool"
          value={state?.pool ?? DEFAULT_VALS.pool}
          error={!state?.pool}
          onChange={handleChange}
          label="TA Unit"
          name="pool"
          required
        >
          {POOL_OPTIONS}
        </Select>
      </FormControl>
    </>
  );
};

export default StudentProfile;
