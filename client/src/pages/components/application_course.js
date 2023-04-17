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
        console.log(props.data)
        this.state = props.data
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
                    <td>
                        <FormControl>
                            <FormLabel id="interest-radio" />
                            <RadioGroup
                                aria-labelledby="interest-radio"
                                defaultValue={0}
                                name="interest-radio-group"
                                value={this.state.interest}
                                row
                            >
                                <FormControlLabel value={0} control={<Radio/>} label={0} labelPlacement="top"/>
                                <FormControlLabel value={1} control={<Radio/>}/>
                                <FormControlLabel value={2} control={<Radio/>}/>
                                <FormControlLabel value={3} control={<Radio/>}/>
                                <FormControlLabel value={4} control={<Radio/>} label={4} labelPlacement="top"/>
                                
                            </RadioGroup>
                        </FormControl>
                    </td>
                </tr>
            </>
        )
    }
}

export default Application