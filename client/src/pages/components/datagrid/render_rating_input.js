import { Rating, Tooltip } from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid";
import { useState } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";

function GridCellRatingInput({ id, value, field, readonly }) {
  const [val, setVal] = useState(value);
  const [tooltipValue, setTooltipValue] = useState(value);

  const apiRef = useGridApiContext();

  async function handleChange(e) {
    const newVal = parseInt(e.target.value);
    setVal(newVal);
    apiRef.current.setEditCellValue({ id, field, value: newVal });
  }

  const labels = {
    1: "Not interested/qualified",
    2: "Weak option",
    3: "Good option",
    4: "Strong option",
    5: "Preferred option",
  };

  return (
    <>
      <Tooltip title={tooltipValue ?? labels[value]} placement="top">
        <Rating
          value={value ?? 2}
          onChange={handleChange}
          onChangeActive={(event, value) => setTooltipValue(labels[value])}
          // onClick={handleChange}
          icon={<CircleIcon />}
          emptyIcon={<CircleOutlinedIcon />}
          readOnly={readonly}
          onMouseLeave={async (e) => {
            if (apiRef.current.getCellMode(id, field) === "edit") {
              await apiRef.current.setEditCellValue(
                { id, field, value: val },
                e
              );
              apiRef.current.stopCellEditMode({ id, field });
              setVal(apiRef.current.getCellValue(id, field));
            }
          }}
        />
      </Tooltip>
    </>
  );
}

export default function renderGridCellRatingInput(params, readonly = false) {
  return <GridCellRatingInput {...params} readonly={readonly} />;
}
