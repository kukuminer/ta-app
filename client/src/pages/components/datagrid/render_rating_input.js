import { Rating } from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid";


function GridCellRatingInput({ id, value, field }) {
    const apiRef = useGridApiContext()
    console.log(id, value, field)

    async function handleChange(e) {
        e.defaultMuiPrevented = true
        await apiRef.current.setEditCellValue({ id, field, value: e.target.value })
        apiRef.current.stopCellEditMode({ id: id, field: field, ignoreModifications: false })
        apiRef.current.publishEvent(
            "cellEditStop",
            {
                id: id,
                field: field,
                value: e.target.value,
                row: { ...apiRef.current.getRow(id) }
            },
            e
        )
    }

    return <>
        <Rating
            value={value ?? 0}
            onChange={handleChange}
            onClick={handleChange}
        />
    </>
}

export default function renderGridCellRatingInput(params) {
    return <GridCellRatingInput {...params} />
}