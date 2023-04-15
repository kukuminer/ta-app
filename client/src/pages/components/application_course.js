import React from "react"
import axios from "axios"
import getUser from "../../getUser"

/**
 * A class for the rows of professor dashboard table
 * Used to modify prof preferences and notes
 */
class Application extends React.Component {
    constructor(props) {
        super(props)
        console.log(props)
    }

    dataKeys = [
        'code', 'name', 'description',
    ]
    columnData = []
    url = ''


    render() {
        return (
            <tr key={this.state.key}>
                <td>
                </td>
                <td>
                </td>
                <td>
                </td>
            </tr>
        )
    }
}

export default Assignment