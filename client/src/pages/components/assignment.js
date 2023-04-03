import React from "react"

class Assignment extends React.Component {
    constructor(props) {
        super(props)
        if (!props.data.pref) props.data.pref = 0
        if (!props.data.note) props.data.note = ''
        this.state = {
            pref: props.data.pref,
            origPref: props.data.pref,
            note: props.data.note,
            origNote: props.data.note
        }
        for (const key of this.dataKeys) {
            this.columnData.push(props.data[key])
        }
        this.columnData[0] = this.columnData[0] + ' ' + this.columnData[1]
        this.columnData.splice(1, 1)
    }

    dataKeys = [
        'firstname', 'lastname', 'grade', 'interest', 'qualification',
    ]
    columnData = []

    doChangesExist = () => {
        var prefChanged = (this.state.pref !== this.state.origPref)
        var noteChanged = (this.state.note !== this.state.origNote)
        return prefChanged || noteChanged
    }

    updateAssignment = () => {
        console.log('updating!')
        // const url = '/api/professor/' + course + '/' + letter + '/' + id
        // const body = {
        //     pref: this.state.pref,
        //     note: this.state.note,
        // }
        // axios.post(url, body)
        //     .then((res) => {
        //         console.log('done!')
        //         console.log(res.data)
        //     })
        //     .catch((error) => {
        //         console.log('error posting pref/note: ', error)
        //     })
        //     // axios.post(url, {pref: 'bingbong'})
        //     setChangesMade(false)

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
                    <input type={'number'} value={this.state.pref} onChange={(event) => this.setState({ pref: Number(event.target.value) })} />
                </td>
                <td>
                    <input type={'text'} value={this.state.note} onChange={(event) => this.setState({ note: event.target.value })} />
                </td>
                <td>
                    <button onClick={this.updateAssignment} disabled={!changesMade}>Update</button>
                </td>
            </tr>
        )
    }
}

export default Assignment