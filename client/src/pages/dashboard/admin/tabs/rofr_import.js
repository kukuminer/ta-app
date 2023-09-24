import CSVTable from "./csv_table"
import React from "react"
// import axios from "axios"

const POST_URL = '/api/admin/rofr'

const ROFRImportTab = () => {
    const colHeaders = [
        "Student Num", "Course Code", "Term Name"
    ]
    const postBody = {
        rows: null,
    }

    return (
        <>

            <CSVTable colHeaders={colHeaders} postBody={postBody} postURL={POST_URL} />
        </>
    )
}

export default ROFRImportTab