import React from "react"
// import axios from "axios"
// import getUser from "../../getUser"
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'

/**
 * A class for the rows of professor dashboard table
 * Used to modify prof preferences and notes
 */
class Application extends React.Component {
    constructor(props) {
        super(props)
        this.state = props.data
        this.state.interest = !this.state.interest ? 0 : this.state.interest
        this.state.qualification = !this.state.qualification ? 0 : this.state.qualification
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
            columns.push(<td key={key} className="td-left-align">{this.props.data[key]}</td>)
        }

        var stateCopy = this.state
        stateCopy.columns = columns
        this.setState(stateCopy)
    }

    /**
     * Posts the changed fields to the DB
     * @param {string} itemKey 
     * @param {onChange event} event 
     */
    handleChange(itemKey, event) {
        var stateCopy = this.state
        stateCopy[itemKey] = event.target.value
        this.setState(stateCopy, () => {
            // do POST
        })
    }

    render() {
        return (
            <>
                <tr key={this.props.rowKey}>
                    {this.state.columns}
                    <td>
                        <FormControl>
                            <FormLabel id="interest-radio" />
                            <RadioGroup
                                aria-labelledby="interest-radio"
                                defaultValue={0}
                                name="interest-radio-group"
                                value={this.state.interest}
                                onChange={(event) => { this.handleChange('interest', event) }}
                                row
                            >
                                <FormControlLabel value={0} control={<Radio />} sx={{ margin: 0, }} labelPlacement="top" label={0} />
                                <FormControlLabel value={1} control={<Radio />} sx={{ margin: 0, }} labelPlacement="top" />
                                <FormControlLabel value={2} control={<Radio />} sx={{ margin: 0, }} labelPlacement="top" label={2} />
                                <FormControlLabel value={3} control={<Radio />} sx={{ margin: 0, }} labelPlacement="top" />
                                <FormControlLabel value={4} control={<Radio />} sx={{ margin: 0, }} labelPlacement="top" label={4} />
                            </RadioGroup>
                        </FormControl>
                    </td>
                    <td>
                        <FormControl>
                            <FormLabel id="interest-radio" />
                            <RadioGroup
                                aria-labelledby="interest-radio"
                                defaultValue={0}
                                name="interest-radio-group"
                                value={this.state.qualification}
                                onChange={(event) => { this.handleChange('qualification', event) }}
                                row
                            >
                                <FormControlLabel value={0} control={<Radio color="secondary" />} labelPlacement="top" sx={{ margin: 0, }} label={0} />
                                <FormControlLabel value={1} control={<Radio color="secondary" />} labelPlacement="top" sx={{ margin: 0, }} />
                                <FormControlLabel value={2} control={<Radio color="secondary" />} labelPlacement="top" sx={{ margin: 0, }} label={2} />
                                <FormControlLabel value={3} control={<Radio color="secondary" />} labelPlacement="top" sx={{ margin: 0, }} />
                                <FormControlLabel value={4} control={<Radio color="secondary" />} labelPlacement="top" sx={{ margin: 0, }} label={4} />
                            </RadioGroup>
                        </FormControl>
                    </td>
                </tr>
            </>
        )
    }
}

export default Application