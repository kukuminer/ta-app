import React from "react"
import axios from "axios"
import getUser from "../../getUser"

const POST_URL = '/api/instructor/assignment'
const DATA_KEYS = [
    'firstname', 'lastname', 'interest', 'qualification',
]


/**
 * A class for the rows of professor dashboard table
 * Used to modify prof preferences and notes
 */
class Assignment extends React.Component {
    constructor(props) {
        super(props)
        if (!props.data.pref) props.data.pref = 0
        if (!props.data.note) props.data.note = ''
        this.state = {
            pref: props.data.pref,
            origPref: props.data.pref,
            note: props.data.note,
            origNote: props.data.note,
            studentNum: props.data.userid,
            sectionId: props.data.sectionid,
        }
        for (const key of DATA_KEYS) {
            this.columnData.push(props.data[key])
        }
        this.columnData[0] = this.columnData[0] + ' ' + this.columnData[1]
        this.columnData.splice(1, 1)
    }

    TIMER = null
    columnData = []

    doChangesExist = () => {
        var prefChanged = (this.state.pref !== this.state.origPref)
        var noteChanged = (this.state.note !== this.state.origNote)
        return prefChanged || noteChanged
    }

    updateAssignment = () => {
        const body = {
            pref: this.state.pref,
            note: this.state.note,
            studentNum: this.state.studentNum,
            sectionId: this.state.sectionId,
            userId: getUser()
        }
        clearTimeout(this.TIMER)
        this.TIMER = setTimeout(
            function () {
                axios.post(POST_URL, body)
                    .then((res) => {
                        this.setState({
                            origNote: res.data[0].note,
                            origPref: res.data[0].pref,
                        })
                        this.render()
                        console.log(this.state)
                    })
                    .catch((error) => {
                        console.log('frontend error posting pref/note: ', error)
                    })
                return () => clearTimeout(this.TIMER)
            }.bind(this),
            500
        )
    }

    render() {
        var tableCells = []
        for (const idx in this.columnData) {
            tableCells.push(<td key={idx}>{this.columnData[idx]}</td>)
        }
        const changesMade = this.doChangesExist()
        return (
            <tr key={this.state.key}>
                {tableCells}
                <td>
                    <select value={this.state.pref} onChange={(event) => this.setState({ pref: Number(event.target.value) }, () => this.updateAssignment())}>
                        <option value={0}>No preference</option>
                        <option value={50}>Acceptable</option>
                        <option value={75}>Requested</option>
                        <option value={100}>Critical</option>
                    </select>
                </td>
                <td>
                    <textarea cols={40} rows={3} type={'text'} value={this.state.note} onChange={(event) => this.setState({ note: event.target.value }, () => this.updateAssignment())} />
                </td>
                <td>
                    <button onClick={this.updateAssignment} disabled={!changesMade}>{changesMade ? 'Saving...' : 'Saved!'}</button>
                </td>
            </tr>
        )
    }
}

export default Assignment