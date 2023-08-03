import React from "react";
import axios from "axios";
import getUser from "../../../getUser";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import ProfileView from "./profile_view";

const StudentDash = () => {
    const id = getUser()

    const [pastTable, setPastTable] = React.useState(null)

    React.useEffect(() => {
        const url = '/api/student/applications/available/' + id
        axios.get(url)
            .then((res) => {
                setPastTable(res.data)
            })
    }, [id])

    return (
        <>
            <ProfileView />
            <h1>
                TA Applications
            </h1>
            <TableContainer className="student-table" sx={{width:'80vw', maxWidth: '1000px'}}>
                <Table>
                    <TableHead >
                        <TableRow>
                            <TableCell sx={{ fontWeight: '700' }}>Term</TableCell>
                            <TableCell sx={{ fontWeight: '700' }}>Availability</TableCell>
                            <TableCell sx={{ fontWeight: '700' }}>On Site?</TableCell>
                            <TableCell sx={{ fontWeight: '700' }}>Application Status</TableCell>
                            <TableCell sx={{ fontWeight: '700' }}>Link</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            !pastTable ? <tr><TableCell>loading...</TableCell></tr> : pastTable.map((val, key) => {
                                return (
                                    <TableRow key={key}>
                                        <TableCell>{val.termname}</TableCell>
                                        <TableCell>{val.availability}</TableCell>
                                        <TableCell>{val.incanada ? 'Yes' : val.incanada === false ? 'No' : ''}</TableCell>
                                        <TableCell>{val.submitted ? 'Submitted' : val.submitted === false ? 'Saved' : 'Available'}</TableCell>
                                        <TableCell>
                                            <Link to={'/application/' + val.term} state={val}>View</Link>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default StudentDash;