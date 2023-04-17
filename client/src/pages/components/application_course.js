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
        this.state = {}
        // this.state.columns = []
        // this.dataKeys.forEach((item) => {
        //     this.state.columns.push(<p>{this.props.data[item]}</p>)
        // })
    }
    componentDidMount() {
        this.makeColumns()
    }

    dataKeys = [
        'code', 'name', 'description',
    ]
    makeColumns() {
        var columns = []
        for (const key of this.dataKeys) {
            columns.push(<td key={key}>{this.props.data[key]}</td>)
        }

        var stateCopy = this.state
        stateCopy.columns = columns
        this.setState(stateCopy)
    }


    render() {
        return (
            <>
                <tr key={this.props.rowKey}>
                    {this.state.columns}
                </tr>
            </>
        )
    }
}

export default Application