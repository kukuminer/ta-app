import { TextField } from "@mui/material"
import { useGridApiContext } from "@mui/x-data-grid"
import { useCallback, useState } from "react"


function GridCellTextFieldInput({ id, value, field }) {
    const apiRef = useGridApiContext()
    const [valueState, setValueState] = useState(value)
    // const apiRef = useGridApiRef()
    // apiRef.current.startCellEditMode({ id, field })

    const handleChange = useCallback(
        (e) => {
            // e.defaultMuiPrevented = true
            console.log(e.target.value)
            setValueState(e.target.value)
            apiRef.current.setEditCellValue(
                { id, field, value: e.target.value, debounceMs: 500 },
                e,
            ).then((res) => {
                console.log('bounced')
            })
        },
        [apiRef, field, id]
    )

    return (
        <TextField
            value={valueState}
            onChange={handleChange}
            // onClick={handleChange}
            fullWidth
            multiline
            maxRows={4}
        />
        //         {/* <MenuItem key='unit 1' id={'unit 1'} value={'unit 1'}>Unit 1 (Full time Graduate student at York)</MenuItem>, */ }

        // {/* <MenuItem key={0} value={1} >No preference</MenuItem> */ }
        // {/* <MenuItem key={50} value={50}>Acceptable</MenuItem> */ }
        // {/* <MenuItem key={75} value={75} label="Requested">Requested</MenuItem> */ }
        // {/* <MenuItem key={100} value={100}>Critical</MenuItem> */ }
        // {/* <option value='no preference'>No preference</option>
        //         <option value='acceptable'>Acceptable</option>
        //         <option value='requested'>Requested</option>
        //         <option value='critical'>Critical</option> */}
        // {/* </TextField> */ }
    )
}

export default function renderGridCellTextFieldInput(params) {
    return <GridCellTextFieldInput {...params} />
}
