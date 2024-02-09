import "./login.css";
import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { wget } from "../requestWrapper";

const NO_USER_NAVIGATE = "/profile";
const DEFAULT_NAVIGATE = "/dashboard";
const USER_URL = "/api/userdata";

const Login = (props) => {
  const [target, setTarget] = React.useState(
    props.target ? props.target : DEFAULT_NAVIGATE
  );
  const [ready, setReady] = React.useState(false);
  const nav = useNavigate();

  React.useEffect(() => {
    const url = USER_URL;
    wget(nav, url)
      .then((res) => {
        console.log(res.data);
        if (!res.data.usertype) {
          setTarget(NO_USER_NAVIGATE);
          setReady(true);
        } else {
          setReady(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [nav]);

  return (
    <>
      hello
      {ready ? <Navigate to={target} /> : <p>Redirecting...</p>}
    </>
  );
};

export default Login;
