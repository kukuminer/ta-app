import { Alert, AlertTitle } from "@mui/material";
import { useState } from "react";
import { PubSub } from "pubsub-js";

export const alertSubName = "requestAlert";

export default function ErrorAlertSub() {
  const [alert, setAlert] = useState({ title: "", msg: "" });

  var alertFunc = (trigger, { title, msg }) => {
    setAlert({ title: title, msg: msg });
  };

  // If you will want to unsub, use var token = the following line
  PubSub.subscribe(alertSubName, alertFunc);

  return (
    <>
      {(alert.title || alert.msg) && (
        <Alert
          severity="error"
          variant="filled"
          onClose={() => {
            alertFunc("closed", { title: "", msg: "" });
          }}
          style={{
            position: "fixed",
            top: "5vh",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <AlertTitle>{alert.title}</AlertTitle>
          {alert.msg}
        </Alert>
      )}
    </>
  );
}
