import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import DatagridTable from "../../../components/datagrid/datagrid_table";

/** @type {GridColDef[]} */
const columns = [
  {
    field: "id",
    headerName: "Id",
    width: 150,
    headerClassName: "section-table-header",
  },
];

const TermWizard = () => {
  const [termName, setTermName] = useState("");
  const [tableRows, setTableRows] = useState();

  useEffect(() => {
    setTableRows([{ id: 3, term: "W23", visible: false }]);
  }, [setTableRows]);

  return (
    <>
      <p>Enter name of new term</p>
      <TextField
        id="termWizardInput"
        value={termName}
        onChange={(e) => setTermName(e.target.value)}
      />
      <p>Existing terms:</p>
      <DatagridTable
        columns={columns}
        idVarName={"id"}
        loading={false}
        onEditStop={null}
        processRowUpdate={null}
        rows={tableRows ?? []}
      />
    </>
  );
};

export default TermWizard;
