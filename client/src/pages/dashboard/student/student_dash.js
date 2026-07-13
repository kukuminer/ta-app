import React, { useEffect, useState } from "react";
import { wget } from "../../requestWrapper";
import { Link, useNavigate } from "react-router-dom";
import ProfileView from "./profile_view";
import DatagridTable from "../../components/datagrid/datagrid_table";

const GET_TERM_APPS = "/api/applicant/termapplications/";

/** @type {import("@mui/x-data-grid").GridColDef[]} */
const columns = [
  {
    field: "term",
    headerName: "Term",
    width: 100,
    headerClassName: "section-table-header",
    hideable: false,
    valueGetter: (_value, row) => {
      return { termid: row.term, term: row.termname };
    },
    valueFormatter: (value) => {
      return value.term;
    },
    sortComparator: (v1, v2) => {
      return v1.termid - v2.termid;
    },
  },
  {
    field: "availability",
    headerName: "Availability (Quarter-Loads)",
    width: 100,
    headerClassName: "section-table-header",
    hideable: false,
    renderCell: (params) => {
      if (params.row.submitted === null) return <></>;
      else return <>{params.value} QL</>;
    },
    valueFormatter: (value) => {
      return value != null ? value + " QL" : "";
    },
  },
  {
    field: "submitted",
    headerName: "Preference Status",
    width: 150,
    headerClassName: "section-table-header",
    hideable: false,
    flex: 1,
    valueFormatter: (value) => {
      return value ? "Submitted" : value === false ? "Draft" : "Available";
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
      return (
        <Link
          to={"/application/" + p.id}
          // onClick={() => {
          //   if (p.row?.explanation === null && p.row?.availability === null) {
          //     console.log("new!");
          //     console.log(p.row);
          //     wpost(null, POST_NEW_TERM, p.row);
          //   }
          // }}
        >
          View
        </Link>
      );
    },
  },
];

const StudentDash = () => {
  const [pastTable, setPastTable] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    async function fetchTable() {
      const res = await wget(nav, GET_TERM_APPS);
      // console.log(res);
      setPastTable(res?.data);
    }
    fetchTable();
  }, [nav]);

  return (
    <>
      <ProfileView />
      <h1>Preferences per Term</h1>
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
