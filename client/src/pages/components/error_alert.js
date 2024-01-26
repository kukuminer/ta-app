import { Alert } from "@mui/material";

export default function ErrorAlert({ visible, message }) {
  return (
    <>
      {visible && (
        <Alert
          severity="error"
          style={{
            position: "fixed",
            top: "5vh",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "26pt",
          }}
        >
          {message}
        </Alert>
      )}
    </>
  );
}
