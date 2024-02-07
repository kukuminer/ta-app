import { Select } from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid";

function GridCellSelectInput({ id, value, field }) {
  const apiRef = useGridApiContext();
  // const apiRef = useGridApiRef()
  // apiRef.current.startCellEditMode({ id, field })

  const handleChange = async (e) => {
    e.defaultMuiPrevented = true;
    await apiRef.current.setEditCellValue({ id, field, value: e.target.value });
    apiRef.current.stopCellEditMode({
      id: id,
      field: field,
      ignoreModifications: false,
    });
    apiRef.current.publishEvent(
      "cellEditStop",
      {
        id: id,
        field: field,
        value: e.target.value,
        row: { ...apiRef.current.getRow(id) },
      },
      e
    );
    // return ret
  };

  return (
    <Select
      value={value}
      onChange={handleChange}
      onClick={handleChange}
      fullWidth
      native
    >
      {/* <MenuItem key='unit 1' id={'unit 1'} value={'unit 1'}>Unit 1 (Full time Graduate student at York)</MenuItem>, */}

      {/* <MenuItem key={0} value={1} >No preference</MenuItem> */}
      {/* <MenuItem key={50} value={50}>Acceptable</MenuItem> */}
      {/* <MenuItem key={75} value={75} label="Requested">Requested</MenuItem> */}
      {/* <MenuItem key={100} value={100}>Critical</MenuItem> */}
      <option value="no preference">No preference</option>
      <option value="acceptable">Acceptable</option>
      <option value="requested">Requested</option>
      <option value="critical">Critical</option>
    </Select>
  );
}

export default function renderGridCellSelectInput(params) {
  return <GridCellSelectInput {...params} />;
}
