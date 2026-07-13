import React from "react";
import { Link, useNavigate } from "react-router-dom";
import DatagridTable from "../../components/datagrid/datagrid_table";
import { wget } from "../../requestWrapper";

const GET_URL = "/api/instructor/courses";

/** @type {import("@mui/x-data-grid").GridComparatorFn} */
const sortOrder = (v1, v2) => {
  return v1.termid - v2.termid;
};

/** @type {import("@mui/x-data-grid").GridColDef[]} */
const columns = [
  {
    field: "term",
    headerName: "Term",
    width: 100,
    headerClassName: "section-table-header",
    valueGetter: (_value, row) => {
      return { termid: row.termid, term: row.term };
    },
    valueFormatter: (value) => {
      return value.term;
    },
    sortComparator: sortOrder,
  },
  {
    field: "course",
    headerName: "Course",
    width: 150,
    headerClassName: "section-table-header",
    flex: 1,
  },
  {
    field: "letter",
    headerName: "Section",
    width: 100,
    headerClassName: "section-table-header",
  },
  {
    field: "campus",
    headerName: "Campus",
    width: 100,
    headerClassName: "section-table-header",
  },
  {
    field: "id",
    headerName: "Link",
    width: 100,
    headerClassName: "section-table-header",
    renderCell: (p) => {
      return <Link to={"/section/" + p.id}>View</Link>;
    },
    sortable: false,
  },
];

const ProfessorDash = () => {
  const [tableData, setTableData] = React.useState(null);
  const nav = useNavigate();

  React.useEffect(() => {
    wget(nav, GET_URL).then((res) => {
      setTableData(res.data);
    });
  }, [nav]);

  return (
    <>
      <h1>Instructor Dashboard</h1>
      <p>Your class sections this term:</p>
      <div className="dash-table">
        <DatagridTable
          columns={columns}
          idVarName={"id"}
          loading={!tableData}
          onEditStop={null}
          processRowUpdate={null}
          rows={tableData ?? []}
          rowHeight={60}
          initialState={{
            sorting: {
              sortModel: [{ field: "term", sort: "desc" }],
            },
          }}
        />
      </div>
      {/* <table className='prof-table'>
                <tbody>
                    <tr>
                        <th>Term</th>
                        <th>Course</th>
                        <th>Section</th>
                        <th>Link</th>
                    </tr>
                    {
                        !tableData ? <tr><td>loading...</td></tr> : tableData.map((val, key) => {
                            return (
                                <tr key={key}>
                                    <td>{val.term}</td>
                                    <td>{val.course}</td>
                                    <td>{val.letter}</td>
                                    <td>
                                        <Link to={'/section/' + val.id}>View</Link>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table> */}
    </>
  );
};

export default ProfessorDash;
