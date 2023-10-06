import { TableRow } from '@mui/material'
import { styled } from '@mui/material/styles'

const CustomTablerow = styled(TableRow, {
    shouldForwardProp: (prop) => prop !== 'color',
})(({ color }) => ({
    ...(color && {
        backgroundColor: color
    })
}))

export default CustomTablerow