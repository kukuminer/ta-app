import React from "react";
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import 'react-tabs/style/react-tabs.css'
// import Box from '@mui/material/Box'
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import GenericImportTab from "./tabs/generic_import";
import ROFRImportTab from "./tabs/rofr_import";
import SectionImportTab from "./tabs/section_import";
import ExportTab from "./tabs/export";
import TermWizard from "./tabs/term_wizard";
// import TabPanel from '@mui/material/TabPanel'

const PANELS = {
  1: <GenericImportTab />,
  2: <ROFRImportTab />,
  3: <SectionImportTab />,
  4: <TermWizard />,
  5: <ExportTab />,
};

const AdminDash = () => {
  const [value, setValue] = React.useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        className="admin-tab-container"
      >
        <Tab value={1} label="Generic Import" />
        <Tab value={2} label="ROFR Import" />
        <Tab value={3} label="Section Import" />
        <Tab value={4} label="Term Wizard" />
        <Tab value={5} label="Export" />
      </Tabs>
      {PANELS[value]}
    </>
  );
};

export default AdminDash;
