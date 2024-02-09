import { Alert, AlertTitle } from "@mui/material";

export default function ErrorAlert({ visible, message, onClose }) {
  return (
    <>
      {visible && (
        <Alert
          severity="error"
          variant="filled"
          onClose={onClose}
          style={{
            position: "fixed",
            top: "5vh",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <AlertTitle>Warning</AlertTitle>
          {message}
        </Alert>
      )}
    </>
  );
}
