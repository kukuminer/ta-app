import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import DatagridTable from "../../../components/datagrid/datagrid_table";
import { wget } from "../../../requestWrapper";
import { useNavigate } from "react-router-dom";

const GET_URL = "/api/admin/terms";

/** @type {GridColDef[]} */
const columns = [
  {
    field: "id",
    headerName: "Id",
    width: 150,
    headerClassName: "section-table-header",
  },
  {
    field: "term",
    headerName: "Term Name",
    width: 150,
    flex: 1,
    headerClassName: "section-table-header",
  },
  {
    field: "visible",
    headerName: "Visible",
    width: 150,
    headerClassName: "section-table-header",
  },
];

const TermWizard = () => {
  const [termName, setTermName] = useState("");
  const [tableRows, setTableRows] = useState([]);

  const nav = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const res = await wget(nav, GET_URL);
      console.log(res);
      setTableRows(res.data);
    }
    fetchData();
  }, [setTableRows, nav]);

  return (
    <>
      <div>
        <p>Enter name of new term</p>
        <TextField
          id="termWizardInput"
          value={termName}
          onChange={(e) => setTermName(e.target.value)}
        />
      </div>
      <p>Existing terms:</p>
      <DatagridTable
        columns={columns}
        idVarName={"id"}
        loading={false}
        onEditStop={null}
        processRowUpdate={null}
        rows={tableRows ?? []}
        rowHeight={40}
        initialState={{
          sorting: {
            sortModel: [{ field: "id", sort: "desc" }],
          },
        }}
      />
    </>
  );
};

export default TermWizard;
