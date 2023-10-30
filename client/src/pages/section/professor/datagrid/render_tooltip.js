import HtmlTooltip from "../../../components/tooltip"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"

function GridCellTooltip({ id, value, field }) {
    return (
        <HtmlTooltip title={<>{value ?? "No details present"}</>}>
            <InfoOutlinedIcon/>
        </HtmlTooltip>
    )
}

export default function renderGridCellTooltip(params) {
    return <GridCellTooltip {...params} />
}
