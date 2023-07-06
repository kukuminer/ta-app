import CSVTable from "./csv_table"
import React from "react"
import axios from "axios"
import getUser from "../../../getUser"

const POST_URL = '/api/admin/rofr'

const ROFRImportTab = () => {
    // Send a function to child componenet (csvreader) and have it run when
    // csv reader finishes
    function postFile(data) {
        console.log(data)
        // const body = {
        //     userId: getUser(),
        //     tableName: selectedTable,
        //     rows: postableData,
        //     columns: keysToUpdate,
        //     constraints: constraints,
        // }
        // axios.post(POST_URL, body)
        //     .then((res) => {
        //         setLastPostStatus(res.status + ' OK')
        //     })
        //     .catch((error) => {
        //         setLastPostStatus('Error, see console log')
        //         console.log('error posting:', error)
        //     })

    }
    const postBody = {
        userId: getUser(),
        rows: null,
    }

    return (
        <>

            <CSVTable postFile={postFile} postBody={postBody} postURL={POST_URL} />
        </>
    )
}

export default ROFRImportTab