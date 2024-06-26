import { useState, useEffect } from "react";
import getUser from "../../../getUser";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { wget } from "../../requestWrapper";

const GET_URL = "/api/user/"; // /userId
const AUX_GET_URL = {
  applicant: "/api/applicant/",
  professor: null,
  admin: null,
};

const DATA_MAP = {
  firstname: "First name",
  lastname: "Surname",
  email: "Email",
};
const DATA_MAP_AUX = {
  applicant: {
    studentnum: "Student Number",
    employeeid: "Employee ID",
    pool: "Applicant pool",
  },
  professor: {},
  admin: {},
};

const ProfileView = () => {
  const [state, setState] = useState({});
  const nav = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const url = GET_URL + getUser();

      try {
        const res1 = await wget(nav, url);
        var auxURL = AUX_GET_URL[res1?.data[0].usertype];
        const res2 = auxURL && (await wget(nav, auxURL + getUser()));

        setState((s) => {
          return { ...s, ...res1?.data[0], ...res2?.data };
        });
      } catch (error) {
        console.log("error fetching in profile banner:", error);
      }

      // setState(res.data.length > 0 ? res.data[0] : { usertype: 'applicant' })
    };

    fetchData();
  }, [nav]);

  return (
    <>
      <div>
        <h2 className="profile-banner-header">Profile data</h2>
        <Table>
          <TableBody>
            <TableRow />
            <TableRow className="profile-banner-row">
              {Object.entries(DATA_MAP).map((v) => {
                return (
                  <TableCell key={v[0]}>
                    {v[1]}: {state[v[0]]}&emsp;
                  </TableCell>
                );
              })}
            </TableRow>
            {state.usertype && (
              <TableRow className="profile-banner-row">
                {Object.entries(DATA_MAP_AUX[state?.usertype]).map((v) => {
                  return (
                    <TableCell key={v[0]}>
                      {v[1]}: {state[v[0]]}&emsp;
                    </TableCell>
                  );
                })}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default ProfileView;
