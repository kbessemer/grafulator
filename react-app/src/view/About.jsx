// GRAFULATOR
// Last Modified: May 17, 2022
// Authored and Developed by: Kyle Bessemer
// LinkedIn: https://www.linkedin.com/in/kyle-bessemer-606a7a1b2/
// GitHub: https://github.com/kbessemer

import React from 'react';
import NOTES from '../release_notes.js';
import MyAppBar from '../controller/AppBar';

// About component
function About(props) {

    // Return statement for about function, consists of release notes, bug reporting, and file format help
    return (
        <div>
            <MyAppBar setTheme={props.setTheme} theme={props.theme} theme2={props.theme2}/>
            <div className="about">
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
              <hr></hr>
              <h2>Custom Formulas</h2>
              When entering a custom formula use "x" to represent the current resolution's graphed value, example: x+1 (will add 1 to every graph point for current resolution)
              <br></br>
              Operators can be chained together to create complex formulas
              <table>
              <thead>
                <tr>
                  <th>Operator</th>
                  <th>Name</th>
                  <th>Example</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>+</td>
                  <td>Add</td>
                  <td>x+1</td>
                </tr>
                <tr>
                  <td>-</td>
                  <td>Subtract</td>
                  <td>x-1</td>
                </tr>
                <tr>
                  <td>*</td>
                  <td>Multiply</td>
                  <td>x*1</td>
                </tr>
                <tr>
                  <td>/</td>
                  <td>Divide</td>
                  <td>x/1</td>
                </tr>
                <tr>
                  <td>%</td>
                  <td>Modulus</td>
                  <td>x%1</td>
                </tr>
                <tr>
                  <td>^</td>
                  <td>Power</td>
                  <td>x^1</td>
                </tr>
                <tr>
                  <td>sqrt</td>
                  <td>Square Root</td>
                  <td>sqrt(x)</td>
                </tr>
                <tr>
                  <td>cos</td>
                  <td>Cosign</td>
                  <td>cos(x)</td>
                </tr>
                <tr>
                  <td>sin</td>
                  <td>Sine</td>
                  <td>sin(x)</td>
                </tr>
                <tr>
                  <td>tan</td>
                  <td>Tangent</td>
                  <td>tan(x)</td>
                </tr>
                <tr>
                  <td>pi</td>
                  <td>pi</td>
                  <td>pi*x</td>
                </tr>
              </tbody>
            </table>
            <a href="https://mathjs.org/docs/expressions/syntax.html" target="_blank">Follow this link for full documentation on math operations</a>
            </div>
        </div>
    )
}

export default About