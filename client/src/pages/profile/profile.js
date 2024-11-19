import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import getUser from "../../getUser";
import { Alert, Button, FormControl } from "@mui/material";
import StudentProfile from "./student/student_profile";
import BaseProfile from "./base_profile";
import "./profile.css";
import { wget, wpost } from "../requestWrapper";

const GET_URL = "/api/user/"; // /userId
const POST_URL = "/api/user/update";
const POST_AUX_URL = {
  applicant: "/api/applicant/update",
  professor: null,
  admin: null,
};

const Profile = () => {
  const [state, setState] = useState({});

  const [alert, setAlert] = useState({
    visible: false,
    html: <Alert severity="error">Failed to update. Please try again</Alert>,
  });

  const nav = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
	const url = GET_URL; //  + getUser();
      const res = await wget(nav, url);

      setState(res.data.length > 0 ? res.data[0] : { usertype: "applicant" });
    };

    fetchData();
  }, [nav]);

  const toggleAlert = async (newVisible = !alert.visible) => {
    setAlert((old) => {
      return {
        ...old,
        visible: newVisible,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    toggleAlert(false);
    try {
      await wpost(nav, POST_URL, { userId: getUser(), state });

      POST_AUX_URL[state.usertype] &&
        (await wpost(nav, POST_AUX_URL[state.usertype], {
          userId: getUser(),
          state,
        }));

      setAlert((old) => {
        return {
          ...old,
          html: <Navigate to="/dashboard" />,
          visible: true,
        };
      });
    } catch (error) {
      console.log("post error:", error);
      toggleAlert(true);
    }
  };

  // console.log(state)
  return (
    <>
      <div className="profile">
        <div className="main">
          <h1>TA Application System Profile</h1>
          <form onSubmit={handleSubmit}>
            <FormControl margin="normal">
              <BaseProfile updateState={setState} state={state} />
              {state?.usertype === "applicant" && (
                <StudentProfile updateState={setState} state={state} />
              )}
              {alert.visible && alert.html}
              <Button variant="contained" type="submit">
                Save
              </Button>
            </FormControl>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;
