import React from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import getUser from "../../../../getUser";
import CSVTable from "./csv_table";
import { useNavigate } from "react-router-dom";
import { wget } from "../../../requestWrapper";

const GET_URL = "/api/admin/tables";
const GET_KEYS_URL = "/api/admin/table/"; //+tablename
const POST_URL = "/api/admin/upsert";

const GenericImportTab = () => {
  const [tables, setTables] = React.useState(null);
  const [selectedTable, setSelected] = React.useState("");
  const [keyCells, setKeyCells] = React.useState(null);
  const [constraints, setConstraints] = React.useState("");
  const [keysToUpdate, setKeysToUpdate] = React.useState("");

  const [body, setBody] = React.useState({});

  const nav = useNavigate();

  React.useEffect(() => {
    wget(nav, GET_URL).then((res) => {
      var tableList = [];
      for (var i in res.data) {
        const name = res.data[i].tablename;
        tableList.push(
          <MenuItem id={name} value={name} key={name}>
            {name}
          </MenuItem>
        );
      }
      setTables(tableList);
    });
  }, [nav]);

  React.useEffect(() => {
    if (tables) setSelected(tables[0].value);
  }, [tables]);

  React.useEffect(() => {
    if (selectedTable) {
      const url = GET_KEYS_URL + selectedTable;
      wget(nav, url).then((res) => {
        const keys = res.data;
        // setKeyList(keys)
        const row = [];
        for (const [idx, key] of Object.entries(keys)) {
          row.push(
            <TableCell
              key={idx}
              sx={
                key.is_nullable === "NO" ? { backgroundColor: "#ddddff" } : {}
              }
            >
              {key.column_name}
            </TableCell>
          );
        }
        setKeyCells(row);
      });
    }
  }, [selectedTable, nav]);

  React.useEffect(() => {
    setBody({
      userId: getUser(),
      tableName: selectedTable,
      rows: null,
      columns: keysToUpdate,
      constraints: constraints,
    });
  }, [selectedTable, keysToUpdate, constraints]);

  return (
    <>
      <FormControl
        id={"table-select-form"}
        fullWidth
        error={!selectedTable}
        sx={{ width: "80vw" }}
      >
        <InputLabel id="table-name">Table</InputLabel>
        <Select
          labelId="table-name"
          id="table-select"
          value={selectedTable ? selectedTable : ""}
          label="Table"
          onChange={(event) => setSelected(event.target.value)}
        >
          {tables}
        </Select>
        <FormHelperText>
          {!selectedTable ? "Please select a table" : ""}
        </FormHelperText>
      </FormControl>
      <h4 className="admin-text">
        {selectedTable +
          " table columns: (blue cells are non-nullable columns)"}
      </h4>
      <div className="admin-table">
        <TableContainer component={Paper}>
          <Table size="small" aria-label="data-table">
            <TableHead>
              <TableRow>{keyCells}</TableRow>
            </TableHead>
            <TableBody></TableBody>
          </Table>
        </TableContainer>
      </div>
      <h4 className="admin-text">
        Please input the column names that you wish to update, separated by
        commas, in the same order that they are present in the uploaded file.
      </h4>
      <TextField
        id="key-text"
        label="Values to insert"
        sx={{ margin: "1em 0", width: "80vw" }}
        onChange={(event) => setKeysToUpdate(event.target.value)}
      />
      <h4 className="admin-text">
        Please input all keys that must be unique, separated by commas (eg.{" "}
        <span className="admin-code">course,letter,term</span> in the 'section'
        table)
        <br />
        These keys will be used for upsert conflict resolution. Leaving it blank
        will cause the insert to fail if a value is already present in the DB.
      </h4>
      <TextField
        id="ukey-text"
        label="Unique constraints"
        sx={{ margin: "1em 0", width: "80vw" }}
        onChange={(event) => setConstraints(event.target.value)}
      />
      <CSVTable
        postBody={body}
        postURL={POST_URL}
        postConditions={[!!selectedTable]}
      />
    </>
  );
};

export default GenericImportTab;
