import CSVTable from "./csv_table"

const POST_URL = '/api/admin/section'
const SectionImportTab = () => {
    const body = {
        rows: null,
    }
    const colHeaders = ['Course Code', 'Letter', 'Term', 'Prof PPY User']

    return (
        <>
            <CSVTable postBody={body} postURL={POST_URL} colHeaders={colHeaders} />
        </>
    )
}

export default SectionImportTab