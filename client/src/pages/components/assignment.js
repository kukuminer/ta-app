import React from "react"
import axios from "axios"

class Assignment extends React.Component {
    constructor(props) {
        super(props)
        if(!props.data.pref) props.data.pref = 0
        if(!props.data.note) props.data.note = ''
        this.state = {
            key: props.rowKey,
            data: props.data,
            pref: props.data.pref,
            note: props.data.note,
        }
        // console.log(props.data)
    }

    updateAssignment = () => {

    }

    doChangesExist = () => {
        var prefChanged = (this.state.pref !== this.state.data.pref)
        var noteChanged = (this.state.note !== this.state.data.note)
        return prefChanged || noteChanged
    }

    render() {
        // There is a chance that the value order may not be maintained here!!!
        var columnData = Object.values(this.state.data)
        columnData[0] = columnData[0] + ' ' + columnData[1]
        columnData.splice(1, 1)
        columnData.splice(4, 2)
        var tableCells = []
        for (const val of columnData) {
            tableCells.push(<td>{val}</td>)
        }
        const changesMade = this.doChangesExist()
        return (
            <tr key={this.state.key}>
                {tableCells}
                <td>
                    <input type={'number'} value={this.state.pref} onChange={(event) => this.setState({pref: Number(event.target.value)})}/>
                </td>
                <td>
                    <input type={'text'} value={this.state.note} onChange={(event) => this.setState({note: event.target.value})}/>
                </td>
                <td>
                    <button onClick={this.updateAssignment} disabled={!changesMade}>Update</button>
                </td>
            </tr>
        )
    }
}

export default Assignment