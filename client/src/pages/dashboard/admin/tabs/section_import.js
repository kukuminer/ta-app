import CSVTable from "./csv_table"

const POST_URL = '/api/admin/section'
const SectionImportTab = () => {
    const body = {
        rows: null,
        headers: ['Course Code', 'Letter', 'Term', 'Prof PPY User'],
    }

    return (
        <>
            <CSVTable postBody={body} postURL={POST_URL} />
        </>
    )
}

export default SectionImportTab