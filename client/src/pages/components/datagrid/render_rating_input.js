import { Rating } from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import CircleIcon from '@mui/icons-material/Circle'
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined'


function GridCellRatingInput({ id, value, field, readonly }) {
    const apiRef = useGridApiContext()
    console.log(id, field, value, readonly)

    const [val, setVal] = useState(value)

    const handleEvent = useCallback(async (params, event, details) => {
        if (params.id === id && params.field === field) {
            await apiRef.current.setEditCellValue({ id: id, field: field, value: val })
        }
    }, [val, apiRef, id, field])

    if(!readonly) {
        apiRef.current.subscribeEvent(
            'cellEditStop',
            handleEvent,
        )
    }

    async function handleChange(e) {
        const newVal = parseInt(e.target.value)
        setVal(newVal)
        await apiRef.current.setEditCellValue({ id: id, field: field, value: newVal })
        apiRef.current.stopCellEditMode({ id: id, field: field })
        apiRef.current.publishEvent(
            "cellEditStop",
            {
                id: id,
                field: field,
                row: { ...apiRef.current.getRow(id) }
            },
            e
        )
    }

    return <>
        <Rating
            value={val ?? 0}
            onChange={handleChange}
            onClick={handleChange}
            icon={<CircleIcon />}
            emptyIcon={<CircleOutlinedIcon />}
            readOnly={readonly}
        />
    </>
}

export default function renderGridCellRatingInput(params, readonly = false) {
    return <GridCellRatingInput {...params} readonly={readonly} />
}