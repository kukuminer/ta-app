import React from "react";
import { wget } from "../../requestWrapper";
import { Link, useNavigate } from "react-router-dom";
import ProfileView from "./profile_view";
import DatagridTable from "../../components/datagrid/datagrid_table";
import { GridColDef } from "@mui/x-data-grid";

const columns: GridColDef = [
  {
    field: "term",
    headerName: "Term",
    width: 100,
    headerClassName: "section-table-header",
    hideable: false,
    valueGetter: (p) => {
      return { termid: p.row.term, term: p.row.termname };
    },
    valueFormatter: (p) => {
      return p.value.term;
    },
    sortComparator: (v1, v2) => {
      return v1.termid - v2.termid;
    },
  },
  {
    field: "availability",
    headerName: "Availability",
    width: 100,
    headerClassName: "section-table-header",
    hideable: false,
  },
  {
    field: "submitted",
    headerName: "Application Status",
    width: 150,
    headerClassName: "section-table-header",
    hideable: false,
    flex: 1,
    valueFormatter: (p) => {
      return p.value ? "Submitted" : p.value === false ? "Draft" : "Available";
    },
  },
  {
    field: "applicant",
    headerName: "Link",
    width: 100,
    headerClassName: "section-table-header",
    sortable: false,
    hideable: false,
    disableColumnMenu: true,
    renderCell: (p) => {
      return <Link to={"/application/" + p.id}>Apply</Link>;
    },
  },
];

const StudentDash = () => {
  const [pastTable, setPastTable] = React.useState(null);
  const nav = useNavigate();

  React.useEffect(() => {
    const url = "/api/applicant/applications/available/";
    async function fetchTable() {
      const res = await wget(nav, url);
      console.log(res);
      setPastTable(res?.data);
    }
    fetchTable();
  }, [nav]);

  return (
    <>
      <ProfileView />
      <h1>TA Applications</h1>
      <div className="dash-table">
        <DatagridTable
          columns={columns}
          idVarName={"term"}
          loading={!pastTable}
          onEditStop={null}
          processRowUpdate={null}
          rows={pastTable ?? []}
          rowHeight={60}
          initialState={{
            sorting: {
              sortModel: [{ field: "term", sort: "desc" }],
            },
          }}
        />
      </div>
    </>
  );
};

export default StudentDash;
