// GRAFULATOR
// Last Modified: March 3, 2022
// Authored and Developed by: Kyle Bessemer
// LinkedIn: https://www.linkedin.com/in/kyle-bessemer-606a7a1b2/
// GitHub: https://github.com/kbessemer

import React from 'react';
import NOTES from './release_notes.js';
import PermanentDrawerRight from "./components/Drawer";

// About component
function About() {

    // Return statement for about function, consists of release notes, bug reporting, and file format help
    return (
        <div>
            <div className="logo">
              <img src="images/logo.png"></img>
            </div>
            <PermanentDrawerRight />
            <h2>Release Notes</h2>
            <table id="UserTable">
              <thead>
                <tr>
                  <th>Version</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {NOTES.map((note, index) => { return ( <tr key={index}><td>{note.version}</td><td>{note.notes}</td></tr>)})}
              </tbody>
            </table>
            <hr></hr>
            <h2>Bug Reports</h2>
            Send all bug reports to: kbessemer@prophecycorp.com
            <hr></hr>
            <h2>Proper File Format</h2>
            While csv files are accepted, xlsx files are recommended. In xlsx files the x-axis will be generated from the first 
            column, <br></br>but in csv files the x-axis will be generated from the first row.
            <br/><br/>
            IMPORTANT! xlsx files have "sheets", the sheet with the data you want read must be named "Sheet1".<br/>
            The sheet labels can be found at the bottom of the excel program, see screenshot below:<br/>
            <img src="sheets.png"></img>
            <br/><br/>
            Files with no header line are accepted, data points will be labeled by number in this situation. 
            <br></br>In xlsx files, if there is no header line the first column must begin with a number, like a timestamp for example.
            <br></br><br></br>
            Example Screenshots:
            <br></br>
            <img src="example1.png"></img>
            <br></br>
            <img src="example3.png"></img>
            <br></br>
            <img src="example2.png"></img>
            <hr></hr>
            <h2>Timestamp Column</h2>
            Please ensure your timestamp column is the first column of the spreadsheet file.<br/>
            <br/>
            Accepted timestamp format:<br/>
            Any epoch format: seconds, milliseconds, or nanoseconds (1633696908886)<br/>
            Or a format like this: 2019-02-24T23:16:57.850Z<br/>
            Or: 2022/03/05 01:45:56
        </div>
    )
}

export default About