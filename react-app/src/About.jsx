import React from 'react';
import NOTES from './release_notes.js';
import PermanentDrawerRight from "./components/Drawer";

function About() {

    return (
        <div>
            <div className="logo">
              <img src="images/opteev_logo.png" width="235" height="42" alt="logo" />
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
        </div>
    )
}

export default About