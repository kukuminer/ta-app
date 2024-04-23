import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import DatagridTable from "../../../components/datagrid/datagrid_table";
import { wget, wpost } from "../../../requestWrapper";
import { useNavigate } from "react-router-dom";

const GET_URL = "/api/admin/terms";
const POST_URL = "/api/admin/term";

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
  const [visCheck, setVisCheck] = useState(true);
  const [tableRows, setTableRows] = useState([]);
  const [tkn, flip] = useState(false);

  const nav = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const res = await wget(nav, GET_URL);
      setTableRows(res.data);
    }
    fetchData();
  }, [setTableRows, nav, tkn]);

  const handlePost = async () => {
    const body = {
      term: termName,
      visible: visCheck,
    };
    try {
      await wpost(nav, POST_URL, body);
      flip(!tkn);
    } catch (e) {
      console.log("Error posting term!");
      console.log(e);
    }
  };

  return (
    <>
      <p>
        Enter name of an existing term to modify it, or a new term to add it
      </p>
      <div style={{ display: "flex", alignItems: "center" }}>
        <TextField
          id="termWizardInput"
          value={termName}
          onChange={(e) => setTermName(e.target.value)}
        />
        <FormControlLabel
          label="Visible?"
          control={
            <Checkbox
              //   sx={{ zIndex: 99 }}
              checked={visCheck}
              //   sx={{ "& .MuiSvgIcon-root": { fontSize: 30 } }}
              //onChange doesn't work sometimes; known MUI problem
              onChange={(e) => {
                setVisCheck(!visCheck);
              }}
              inputProps={{ "aria-label": "controlled" }}
            />
          }
        />
        <Button variant="contained" onClick={handlePost}>
          Add
        </Button>
      </div>
      <p>Existing terms:</p>
      <DatagridTable
        // style={{ width: "50%" }}
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
