import React from 'react';
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import 'react-tabs/style/react-tabs.css'
// import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import GenericImportTab from './generic_import';
import ROFRImportTab from './rofr_import';
// import TabPanel from '@mui/material/TabPanel'

const PANELS = {
    '1': <GenericImportTab/>,
    '2': <ROFRImportTab/>,
}

const AdminDash = () => {
    const [value, setValue] = React.useState('1')

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    return (
        <>
            <Tabs
                value={value}
                onChange={handleChange}
                textColor="secondary"
                indicatorColor="secondary"
                aria-label="secondary tabs example"
            >
                <Tab value="1" label="Generic Import" />
                <Tab value="2" label="ROFR Import" />
                <Tab value="3" label="Export" />
            </Tabs>
            {PANELS[value]}
        </>
    )
}

export default AdminDash