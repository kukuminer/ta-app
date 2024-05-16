import { Button, Popover, Typography } from "@mui/material";
// import HtmlTooltip from "../tooltip"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useState } from "react";

function GridCellTooltip({ id, value, field }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? "popover" : undefined;

  return (
    // <HtmlTooltip title={
    //     <div style={{ whiteSpace: 'pre-line' }}>
    //         {value ?? "No details present"}
    //     </div>
    // }>
    //     <InfoOutlinedIcon />
    // </HtmlTooltip>
    <div>
      <Button
        aria-describedby={popoverId}
        variant="contained"
        onClick={handleClick}
      >
        <InfoOutlinedIcon />
      </Button>
      <Popover
        id={popoverId}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Typography sx={{ p: 2 }} style={{ whiteSpace: "pre-line" }}>
          {value ?? "No details present"}
        </Typography>
      </Popover>
    </div>
  );
}

export default function renderGridCellTooltip(params) {
  return <GridCellTooltip {...params} />;
}
