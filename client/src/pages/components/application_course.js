import React from "react"
import axios from "axios"
import getUser from "../../getUser"
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TableCell, TableRow } from '@mui/material'

/**
 * A class for the rows of professor dashboard table
 * Used to modify prof preferences and notes
 */
class Application extends React.Component {
    URL = '/api/applicant/application'
    dataKeys = [ // These are the keys that get displayed in the columns
        'codename', 'name', //description
    ]

    constructor(props) {
        super(props)
        this.state = props.data
        this.state.term = props.term
        this.state.userId = getUser()
        this.state.interest = !this.state.interest ? 0 : this.state.interest
        this.state.qualification = !this.state.qualification ? 0 : this.state.qualification
    }
    componentDidMount() {
        this.makeColumns()
    }

    makeColumns() {
        var columns = []
        for (const key of this.dataKeys) {
            columns.push(<TableCell key={key} sx={{ fontSize: 'large' }}>{this.props.data[key]}</TableCell>)
        }

        var stateCopy = this.state
        stateCopy.columns = columns
        this.setState(stateCopy)
    }

    /**
     * Posts the changed fields to the DB
     * Updates state first, then axios posts in callback
     * @param {string} itemKey 
     * @param {onChange event} event 
     */
    handleChange(itemKey, event) {
        var stateCopy = this.state
        stateCopy[itemKey] = event.target.value
        this.setState(stateCopy, () => {
            // do POST
            const body = {
                userId: this.state.userId,
                course: this.state.code,
                term: this.state.term,
                interest: this.state.interest,
                qualification: this.state.qualification,
            }
            axios.post(this.URL, body)
                .then((res) => {
                    // TODO: Add visual response when successful
                    this.setState({
                        interest: res.data[0].interest,
                        qualification: res.data[0].qualification,
                    })
                })
        })
    }

    render() {
        return (
            <>
                <TableRow key={this.props.rowKey} sx={{ fontSize: '40pt', backgroundColor: this.state.rightOfRefusal ? '#ccffcc' : 'default' }}>
                    {this.state.columns}
                    <TableCell>
                        <FormControl fullWidth>
                            <FormLabel id="interest-radio" />
                            <RadioGroup
                                aria-labelledby="interest-radio"
                                defaultValue={0}
                                name="interest-radio-group"
                                value={this.state.interest}
                                onChange={(event) => { this.handleChange('interest', event) }}
                                row
                                sx={{justifyContent: 'center'}}
                            >
                                <FormControlLabel value={0} control={<Radio />} sx={{ margin: 0, }} labelPlacement="top" label={0} />
                                <FormControlLabel value={1} control={<Radio />} sx={{ margin: 0, }} labelPlacement="top" />
                                <FormControlLabel value={2} control={<Radio />} sx={{ margin: 0, }} labelPlacement="top" label={2} />
                                <FormControlLabel value={3} control={<Radio />} sx={{ margin: 0, }} labelPlacement="top" />
                                <FormControlLabel value={4} control={<Radio />} sx={{ margin: 0, }} labelPlacement="top" label={4} />
                            </RadioGroup>
                        </FormControl>
                    </TableCell>
                    <TableCell >
                        <FormControl fullWidth >
                            <FormLabel id="interest-radio" />
                            <RadioGroup
                                aria-labelledby="interest-radio"
                                defaultValue={0}
                                name="interest-radio-group"
                                value={this.state.qualification}
                                onChange={(event) => { this.handleChange('qualification', event) }}
                                row
                                sx={{justifyContent: 'center'}}
                            >
                                <FormControlLabel value={0} control={<Radio color="secondary" />} labelPlacement="top" sx={{ margin: 0, }} label={0} />
                                <FormControlLabel value={1} control={<Radio color="secondary" />} labelPlacement="top" sx={{ margin: 0, }} />
                                <FormControlLabel value={2} control={<Radio color="secondary" />} labelPlacement="top" sx={{ margin: 0, }} label={2} />
                                <FormControlLabel value={3} control={<Radio color="secondary" />} labelPlacement="top" sx={{ margin: 0, }} />
                                <FormControlLabel value={4} control={<Radio color="secondary" />} labelPlacement="top" sx={{ margin: 0, }} label={4} />
                            </RadioGroup>
                        </FormControl>
                    </TableCell>
                    {/* <TableCell sx={{visibility: this.state.rightOfRefusal ? 'default' : 'hidden'}}>
                        <HtmlTooltip title={
                            <>
                                {"You have priority for this course because you were a TA for it in the previous term."}
                            </>
                        }>
                            <Button>
                                ?
                            </Button>
                        </HtmlTooltip>
                    </TableCell> */}
                </TableRow>
            </>
        )
    }
}

export default Application