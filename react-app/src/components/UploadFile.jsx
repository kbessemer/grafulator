// GRAFULATOR
// Last Modified: March 3, 2022
// Authored and Developed by: Kyle Bessemer
// LinkedIn: https://www.linkedin.com/in/kyle-bessemer-606a7a1b2/
// GitHub: https://github.com/kbessemer

import React from 'react';
import Tooltip2 from '@mui/material/Tooltip';
import AlertSnackbar from './alerts/AlertSnackbar';
import Plot from 'react-plotly.js';
import SERVERIP from '../constants.js';
import Statistics from 'statistics.js';

// Upload file component
function UploadFile() {

  // Setup react hooks
  const [graphDataFinal, setGraphDataFinal] = React.useState({});
  const [graphList, setGraphList] = React.useState([]);
  const [myState, setMyState] = React.useState({});
  const [plotSize, setPlotSize] = React.useState({});
  const [rangeStart, setRangeStart] = React.useState();
  const [rangeStop, setRangeStop] = React.useState();
  const [statData, setStatData] = React.useState({});

  // Do this on screen load
  React.useEffect(() => {
    GetGraphList();
  }, [])

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
              DrawGraph(result.data.data, result.data.labels);
              GetGraphList();
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

  // Function for creating the graph
  function DrawGraph(data, labels) {
    var graphDataSets = [];
    // Set graph size
    setPlotSize({width: 1100, height: 700});
    // Iterate over the data in api response
    for (var x in data) {
      // Choose a random color for each line
      const randomColor = Math.floor(Math.random()*16777215).toString(16);
      var color = "#" + randomColor;
      // Create a data entry for each line
      graphDataSets.push({type: 'line', name: data[x].label, mode: 'lines+markers', marker: {color: color}, x: labels, y: data[x].data});
    }
    // Adjust react hooks
    setGraphDataFinal({data: graphDataSets, data2: graphDataSets, labels: labels, stats: false});
    setMyState({Loading: false, isUploaded: true})
  }

  // Function for choosing a range in the graph
  function GraphRange(start, stop) {
    var yLabels = [];
    var graphDataSets = [];
    var labels = [];
    // Create a list of labels
    for (var x = start; x <= stop; x++) {
      labels.push(graphDataFinal.labels[x])
    }
    // Iterate over graph data
    for (var x in graphDataFinal.data) {
      var rangeData = [];
      for (var y = start; y <= stop; y++) {
        rangeData.push(graphDataFinal.data[x].y[y])
      }
      // Choose a random color for each line
      const randomColor = Math.floor(Math.random()*16777215).toString(16);
      var color = "#" + randomColor;
      // Create y axis labels
      yLabels.push(graphDataFinal.data[x].name);
      // Create a data entry for each line
      graphDataSets.push({type: 'line', name: graphDataFinal.data[x].name, mode: 'lines+markers', marker: {color: color}, x: labels, y: rangeData});
    }
    // Adjust react hook
    setGraphDataFinal({data: graphDataFinal.data, data2: graphDataSets, labels: graphDataFinal.labels, yLabels: yLabels, range: true, stats: false});
  }

  // Function for the statistics summary for the selected range
  function CalcStats(index) {
    var data = [];
    var statLength = graphDataFinal.data2[index].y.length - 1
    // Iterate over graph data, create a data array with values
    for (var x = 0; x <= statLength; x++) {
      console.log(parseFloat(graphDataFinal.data2[index].y[x]));
      data.push({ID: x, value: parseFloat(graphDataFinal.data2[index].y[x])})
    }
    // Adjust react hook
    setGraphDataFinal({data: graphDataFinal.data, data2: graphDataFinal.data2, labels: graphDataFinal.labels, yLabels: graphDataFinal.yLabels, range: true, stats: true})

    // Identify columns for statistics.js
    var columns = {
      ID: 'ordinal',
      value: 'interval',
    }

    // Identify settings for statistics.js
    var settings = {
      excludeColumns: ["ID"],
      suppressWarnings: true,
    };

    // Identify a new statistics
    var stats = new Statistics(data, columns, settings);

    // Adjust react hook with statistics data
    setStatData({minimum: stats.minimum("value"), maximum: stats.maximum("value"), range: stats.range("value"), mean: stats.mean("value"), median: stats.median("value"), mode: stats.mode("value"), variance: stats.variance("value"), stddev: stats.standardDeviation("value"), co: stats.coefficientOfVariation("value")})
  }

  // Function for fetching the list of graphs from the database
  function GetGraphList() {
    var url = SERVERIP + 'getgraphs';
    // Backend api call
    fetch(url, {
        headers: {
          'Authorization': localStorage.getItem('session-id')
        },
      })
        .then(res => res.json())
        .then(
          (result) => {
            // On success response
            if (result.Success) {
              setGraphList(result.Data);
            } else {
              // On error response - bad token
              if (result.Error == "Bad token") {
                setMyState({SessionError: true})
                setTimeout(() => setMyState({SessionError: false}), 3000);
                return
              }
            }
          },
          (error) => {
            console.log(error);
          }
        )
    return
  }

  // Function for when a graph is selected from the history list
  function ViewPastGraph(id) {
    setMyState({Loading: true})
    // Request body
    var postBody = {
      ID: id,
    };
    var url = SERVERIP + 'graph'
    // Fetch from backend api
    fetch(url, {
      method: 'post',
      body: JSON.stringify(postBody),
      headers: {
        'Authorization': localStorage.getItem('session-id')
      },
    }).then(response => response.json())
    .then(json => {
      // On success response
      if (json.Success) {
        // Create graph
        DrawGraph(json.Data.GraphData.data, json.Data.GraphData.labels);
      } else {
        // On error response - bad token
        if (json.Error == "Bad token") {
          setMyState({SessionError: true, Loading: false})
          setTimeout(() => setMyState({SessionError: false}), 3000);
          return
        }
      }
    });
  }

  // Function for deleting a graph from the database
  function DeleteGraphPost(id) {
    setMyState({Loading: true})
    var url = SERVERIP + 'deletegraph'
    // Backend api call
    fetch(url, {
      method: 'post',
      body: JSON.stringify({
        _id: id,
      }),
      headers: {
        'Authorization': localStorage.getItem('session-id')
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then(response => response.json())
    .then(json => {
      // On success response
      if (json.Success) {
        setMyState({GraphDeleted: true, Loading: false});
        GetGraphList()
        setTimeout(() => setMyState({GraphDeleted: false}), 3000);
      // On error response - bad token
      } else {
          if (json.Error === "Bad token") {
            setMyState({SessionError: true, Loading: false})
            setTimeout(() => setMyState({SessionError: false}), 3000);
            return
          }
      }
    });
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
    if (graphList != null) {
      return graphList.map((graph, index) => { return ( <tr key={index}><td>{graph._id}</td><td>{graph.Timestamp}</td><td><Tooltip2 title="View Graph"><a onClick={() => ViewPastGraph(graph._id)} href="#"><img className="icon" src="images/eye-arrow-right.png"></img></a></Tooltip2></td><td><Tooltip2 title="Delete Graph"><a onClick={() => DeleteGraphPost(graph._id)} href="#"><img className="icon" src="images/delete.png"></img></a></Tooltip2></td></tr>)})
    } else {
      return <tr><td>No graphs in database</td><td></td><td></td><td></td></tr>
    }
  }

  // Function for toggling full screen mode for the graph
  function toggleFullscreen() {
    // Adjust react hook, set graph size to user's resolution
    setPlotSize({width: window.screen.width, height: window.screen.height});
    // Set element to fullscreen
    document.getElementById("myPlot").requestFullscreen().catch(console.log());
    // Add listener for when fullscreen mode is exited
    var el = document.getElementById('myPlot');
    el.addEventListener('fullscreenchange', fullscreenchanged);
  }

  // Function for when full screen mode is exited
  function fullscreenchanged(event) {
    if (document.fullscreenElement) {
      console.log(`Element: ${document.fullscreenElement.id} entered fullscreen mode.`);
    } else {
      console.log('Leaving fullscreen mode.');
      // Reset graph size to default
      setPlotSize({width: 1100, height: 700});
    }
  };

  // Function for the range start dropdown
  function rangeStartFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
  // Function for the range start filter (search)
  function rangeStartFilter() {
    var input, filter, div, txtValue, ul, li, a, i;
    input = document.getElementById("rangeStartInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
      txtValue = a[i].textContent || a[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = "";
      } else {
        a[i].style.display = "none";
      }
    }
  }

  // Function for the range stop dropdown
  function rangeStopFunction() {
    document.getElementById("myDropdown2").classList.toggle("show");
  }
  
  // Function for the range stop filter (search)
  function rangeStopFilter() {
    var input, filter, div, txtValue, ul, li, a, i;
    input = document.getElementById("rangeStopInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdown2");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
      txtValue = a[i].textContent || a[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = "";
      } else {
        a[i].style.display = "none";
      }
    }
  }

  // Function for the staistics dropdown
  function statFunction() {
    document.getElementById("myDropdown3").classList.toggle("show");
  }
  
  // Function for the statistics filter (search)
  function statFilter() {
    var input, filter, div, txtValue, ul, li, a, i;
    input = document.getElementById("statInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdown3");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
      txtValue = a[i].textContent || a[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = "";
      } else {
        a[i].style.display = "none";
      }
    }
  }
  
  // Return statement for the upload file component, consists of alerts, graph when data is present, upload file drop zone,
  // graph options such as statistics and range, and graph history from the database
  return (
    <div>
      {myState.Loading ? <AlertSnackbar open={true} message="Loading" severity="warning"/> : null}
      {myState.FileError ? <AlertSnackbar open={true} message="Error reading file! See About & Help" severity="error"/> : null}
      {myState.FileExtError ? <AlertSnackbar open={true} message="Unsupported file type! csv or xlsx only" severity="error"/> : null}
      {myState.SessionError ? <AlertSnackbar open={true} message="Session has expired! Login again" severity="error"/> : null}
      {myState.GraphDeleted ? <AlertSnackbar open={true} message="Graph deleted!" severity="success"/> : null}
      {myState.isUploaded ? <div className="left-margin"><br></br><br></br><a onClick={toggleFullscreen} href="#"><Tooltip2 title="Enter Fullscreen"><img className="icon" src="images/fullscreen.png"></img></Tooltip2></a></div> : null}
      
      {myState.isUploaded ? <div className="left-margin"><div class="dropdown">
            <button onClick={rangeStartFunction} class="dropbtn">RANGE START</button>
            <div id="myDropdown" class="dropdown-content">
              <input type="text" placeholder="Search.." id="rangeStartInput" onKeyUp={rangeStartFilter}/>
              {graphDataFinal.labels.map((label, index) => { return ( <a key={index} onClick={() => setRangeStart(index)}>{label}</a> )})}
            </div>
          </div>
          <div class="dropdown">
            <button onClick={rangeStopFunction} class="dropbtn">RANGE STOP</button>
            <div id="myDropdown2" class="dropdown-content">
              <input type="text" placeholder="Search.." id="rangeStopInput" onKeyUp={rangeStopFilter}/>
              {graphDataFinal.labels.map((label, index) => { return ( <a key={index} onClick={() => setRangeStop(index)}>{label}</a> )})}
            </div>
          </div>
          <input className="add-user" type="submit" value="VIEW RANGES" onClick={() => GraphRange(rangeStart, rangeStop)}/>
          <input className="add-user" type="submit" value="RESET RANGES" onClick={() =>     setGraphDataFinal({data: graphDataFinal.data, data2: graphDataFinal.data, labels: graphDataFinal.labels})}/>
        </div> : null}
      <br/><br/>
      {graphDataFinal.range ? <div className="left-margin"><div class="dropdown">
            <button onClick={statFunction} class="dropbtn">VIEW STATISTICS</button>
            <div id="myDropdown3" class="dropdown-content">
              <input type="text" placeholder="Search.." id="statInput" onKeyUp={statFilter}/>
              {graphDataFinal.yLabels.map((label, index) => { return ( <a key={index} onClick={() => CalcStats(index)}>{label}</a> )})}
            </div>
          </div>
        </div> : null}

      {graphDataFinal.stats ? <div className="left-margin statZone">
      <strong>Minimum: </strong>{statData.minimum}
      <br/>
      <strong>Maximum: </strong>{statData.maximum}
      <br/>
      <strong>Range: </strong>{statData.range}
      <br/>
      <strong>Mean: </strong>{statData.mean}
      <br/>
      <strong>Median: </strong>{statData.median}
      <br/>
      <strong>Mode: </strong>{statData.mode}
      <br/>
      <strong>Variance: </strong>{statData.variance}
      <br/>
      <strong>Standard Deviation: </strong>{statData.stddev}
      <br/>
      <strong>Coefficient of Variation: </strong>{statData.co}
      <br/>
      </div> : null}

      {myState.isUploaded ? <div id="myPlot"><Plot
          data={graphDataFinal.data2}
          layout={ {width: plotSize.width, height: plotSize.height, title: '', xaxis: {'type': 'category'}} }
        /></div> : null}

        <br></br><br></br>
        <div id="dropZone" onDrop={dropHandler} onDragOver={dragOverHandler}>
          <p className="dropZone">Drag one or more files to upload and generate a graph</p>
        </div>
        
        <br></br>
        <div><form className="formStyle8">
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