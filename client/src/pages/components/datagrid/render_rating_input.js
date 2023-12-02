import { Rating, Tooltip } from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";

function GridCellRatingInput({ id, value, field, readonly }) {
  const apiRef = useGridApiContext();

  const [val, setVal] = useState(value);
  const [tooltipValue, setTooltipValue] = useState(value);

  const handleEvent = useCallback(
    async (params, event, details) => {
      if (params.id === id && params.field === field) {
        await apiRef.current.setEditCellValue({
          id: id,
          field: field,
          value: val,
        });
      }
    },
    [val, apiRef, id, field]
  );

  if (!readonly) {
    apiRef.current.subscribeEvent("cellEditStop", handleEvent);
  }

  async function handleChange(e) {
    const newVal = parseInt(e.target.value);
    setVal(newVal);
    await apiRef.current.setEditCellValue({
      id: id,
      field: field,
      value: newVal,
    });
    apiRef.current.stopCellEditMode({ id: id, field: field });
    apiRef.current.publishEvent(
      "cellEditStop",
      {
        id: id,
        field: field,
        row: { ...apiRef.current.getRow(id) },
      },
      e
    );
  }

  const labels = {
    1: "Not interested/qualified",
    2: "Weak option",
    3: "Good option",
    4: "Strong option",
    5: "Preferred option",
  };
  setTooltipValue(labels[val ?? 2]);

  return (
    <>
      <Tooltip title={tooltipValue}>
        <Rating
          value={val ?? 2}
          onChange={handleChange}
          onChangeActive={(event, value) => setTooltipValue(labels[value])}
          onClick={handleChange}
          icon={<CircleIcon />}
          emptyIcon={<CircleOutlinedIcon />}
          readOnly={readonly}
        />
      </Tooltip>
    </>
  );
}

export default function renderGridCellRatingInput(params, readonly = false) {
  return <GridCellRatingInput {...params} readonly={readonly} />;
}
