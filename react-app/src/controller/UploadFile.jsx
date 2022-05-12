// GRAFULATOR
// Last Modified: March 3, 2022
// Authored and Developed by: Kyle Bessemer
// LinkedIn: https://www.linkedin.com/in/kyle-bessemer-606a7a1b2/
// GitHub: https://github.com/kbessemer

import React from 'react';
import { evaluate } from 'mathjs';
import Tooltip2 from '@mui/material/Tooltip';
import AlertSnackbar from './AlertSnackbar';
import Plot from 'react-plotly.js';
import SERVERIP from '../constants.js';
import Statistics from 'statistics.js';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

// Upload file component
function UploadFile(props) {

  // Setup react hooks
  const [myState, setMyState] = React.useState({});
  const [rangeStart, setRangeStart] = React.useState(null);
  const [rangeStop, setRangeStop] = React.useState(null);
  const [formula, setFormula] = React.useState(null);
  const handleOpenStats = () => props.setStatsOpen(true);
  const handleCloseStats = () => props.setStatsOpen(false);

  // Do this on screen load
  React.useEffect(() => {
    props.GetGraphList();
  }, [])

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: '#1d1f23',
    border: '2px solid #2e363f',
    boxShadow: 24,
  };

  // Function for the file drop zone
  function dropHandler(ev) {
    setMyState({Loading: true})
    console.log('File(s) dropped');
    if (ev.dataTransfer.items) {
        ev.preventDefault();
        // If dropped items aren't files, reject them
        if (ev.dataTransfer.items[0].kind === 'file') {
          var file = ev.dataTransfer.items[0].getAsFile();
          var data = new FormData()
          data.append('file', file)
          var url = SERVERIP + 'upload';
          // Send dropped file to backend api
          fetch(url, {
            method: 'post',
            body: data,
            headers: {
              'Authorization': localStorage.getItem('session-id')
            },
        }).then(response => response.json())
        .then(
          (result) => {
            // On success response
            if (result.Success) {
              // Create graph
              props.DrawGraph(result.data.data, result.data.labels);
              props.GetGraphList();
              setMyState({Loading: false});
            } else {
              // On error response - bad extension
              if (result.Error == 'Bad extension') {
                setMyState({FileExtError: true, Loading: false});
                setTimeout(() => setMyState({FileExtError: false}), 3000);
                return
              // On error response - bad token
              } else if (result.Error === "Bad token") {
                setMyState({SessionError: true, Loading: false})
                setTimeout(() => setMyState({SessionError: false}), 3000);
                return
              // On error response - file could not be read
              } else {
                setMyState({FileError: true, Loading: false});
                setTimeout(() => setMyState({FileError: false}), 3000);
                return
              }
            }
          },
          (error) => {
            console.log(error);
          }
        );
        }
    }
    }

  // Handler for file drop zone
  function dragOverHandler(ev) {
    console.log('File(s) in drop zone');
    ev.preventDefault();
  }

  // Fuction for filtering the graph database table (search)
  function FilterTable() {
    // Declare variables
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myFilter");
    filter = input.value.toUpperCase();
    table = document.getElementById("GraphTable");
    tr = table.getElementsByTagName("tr");
  
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[1];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }

  // Function for building the list of graphs from the database
  function GraphListFunc() {
    if (props.graphList != null) {
      return props.graphList.map((graph, index) => { return ( <tr key={index}><td>{graph._id}</td><td>{graph.Timestamp}</td><td><Tooltip2 title="View Graph"><a onClick={() => props.ViewPastGraph(graph._id)} href="#"><img className="icon" src="images/eye-arrow-right.png"></img></a></Tooltip2></td><td><Tooltip2 title="Delete Graph"><a onClick={() => props.DeleteGraphPost(graph._id)} href="#"><img className="icon" src="images/delete.png"></img></a></Tooltip2></td></tr>)})
    } else {
      return <tr><td>No graphs in database</td><td></td><td></td><td></td></tr>
    }
  }
  
  // Return statement for the upload file component, consists of alerts, graph when data is present, upload file drop zone,
  // graph options such as statistics and range, and graph history from the database
  return (
    <div>
      {myState.Loading ? <AlertSnackbar open={true} message="Loading" severity="warning"/> : null}
      {props.myState.Loading ? <AlertSnackbar open={true} message="Loading" severity="warning"/> : null}
      {myState.FileError ? <AlertSnackbar open={true} message="Error reading file! See About & Help" severity="error"/> : null}
      {myState.BlankRangeError ? <AlertSnackbar open={true} message="You must select a range! Click RANGE START & RANGE STOP" severity="error"/> : null}
      {myState.RangeError ? <AlertSnackbar open={true} message="Incorrect range! Stopping point must be greater than starting point" severity="error"/> : null}
      {myState.formulaError ? <AlertSnackbar open={true} message="You must input a formula to use a 0 second resolution!" severity="error"/> : null}
      {props.myState.labelError ? <AlertSnackbar open={true} message="You must select a label! Click VIEW STATISTICS" severity="error"/> : null}
      {props.myState.statisticError ? <AlertSnackbar open={true} message="You must select a statistic! Click SET STATISTIC" severity="error"/> : null}
      {myState.FileExtError ? <AlertSnackbar open={true} message="Unsupported file type! csv or xlsx only" severity="error"/> : null}
      {myState.SessionError ? <AlertSnackbar open={true} message="Session has expired! Login again" severity="error"/> : null}
      {props.myState.SessionError ? <AlertSnackbar open={true} message="Session has expired! Login again" severity="error"/> : null}
      {props.myState.GraphDeleted ? <AlertSnackbar open={true} message="Graph deleted!" severity="success"/> : null}

        <div id="dropZone" onDrop={dropHandler} onDragOver={dragOverHandler}>
          <p className="dropZone">Drag one or more files to upload and generate a graph</p>
        </div>
        
        <br></br>
        <div className="Graph-List">
            <div className="Content-Header"><img class="Header-Icon" width="48px" height="48px" src="images/graph.png"></img><h3>Graph History</h3></div>
            <form className="formStyle8">
              <ul>
                <li>
                    <label htmlFor="myFilter">Search</label>
                    <input type="text" id="myFilter" onKeyUp={FilterTable} placeholder="...by timestamp"/>
                </li>
                <li>
                </li>
              </ul>
            </form>
            <table id="GraphTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Timestamp</th>
                <th>View</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
            <GraphListFunc />
            </tbody>
          </table></div>
    </div>
    )
}

export default UploadFile