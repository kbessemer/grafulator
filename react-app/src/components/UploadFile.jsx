import React from 'react';
import Tooltip2 from '@mui/material/Tooltip';
import AlertSnackbar from './alerts/AlertSnackbar';
import Plot from 'react-plotly.js';
import SERVERIP from '../constants.js';

function UploadFile() {

  const [graphDataFinal, setGraphDataFinal] = React.useState({});
  const [graphList, setGraphList] = React.useState([]);
  const [myState, setMyState] = React.useState({});
  const [plotSize, setPlotSize] = React.useState({});
  const [rangeStart, setRangeStart] = React.useState();
  const [rangeStop, setRangeStop] = React.useState();

  function dropHandler(ev) {
    setMyState({Loading: true})
    console.log('File(s) dropped');
    // Prevent default behavior (Prevent file from being opened)
    if (ev.dataTransfer.items) {
        ev.preventDefault();
        // If dropped items aren't files, reject them
        if (ev.dataTransfer.items[0].kind === 'file') {
          var file = ev.dataTransfer.items[0].getAsFile();
          var data = new FormData()
          data.append('file', file)
          var url = SERVERIP + 'upload';
          fetch(url, {
            method: 'post',
            body: data,
            headers: {
              'Authorization': localStorage.getItem('session-id')
            },
        }).then(response => response.json())
        .then(
          (result) => {
            if (result.Success) {
              DrawGraph(result.data.data, result.data.labels);
              GetGraphList();
            } else {
              if (result.Error == 'Bad extension') {
                setMyState({FileExtError: true, Loading: false});
                setTimeout(() => setMyState({FileExtError: false}), 3000);
                return
              } else if (result.Error === "Bad token") {
                setMyState({SessionError: true, Loading: false})
                setTimeout(() => setMyState({SessionError: false}), 3000);
                return
              } else {
                setMyState({FileError: true, Loading: false});
                setTimeout(() => setMyState({FileError: false}), 3000);
                return
              }
            }
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            console.log(error);
          }
        );
        }
    }
    }

  function dragOverHandler(ev) {
    console.log('File(s) in drop zone');
  
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  }

  function DrawGraph(data, labels) {
    var graphDataSets = [];
    console.log("Draw Graph Executed")
    setPlotSize({width: 1100, height: 700});
    for (var x in data) {
      const randomColor = Math.floor(Math.random()*16777215).toString(16);
      var color = "#" + randomColor;
      graphDataSets.push({type: 'line', name: data[x].label, mode: 'lines+markers', marker: {color: color}, x: labels, y: data[x].data});
    }
    setGraphDataFinal({data: graphDataSets, data2: graphDataSets, labels: labels});
    setMyState({Loading: false, isUploaded: true})
  }

  function GraphRange(start, stop) {
    console.log("Start:");
    console.log(start);
    console.log("Stop:");
    console.log(stop);
    var graphDataSets = [];
    var labels = [];
    for (var x = start; x <= stop; x++) {
      labels.push(graphDataFinal.labels[x])
    }
    for (var x in graphDataFinal.data) {
      var rangeData = [];
      for (var y = start; y <= stop; y++) {
        rangeData.push(graphDataFinal.data[x].y[y])
      }
      const randomColor = Math.floor(Math.random()*16777215).toString(16);
      var color = "#" + randomColor;
      graphDataSets.push({type: 'line', name: graphDataFinal.data[x].name, mode: 'lines+markers', marker: {color: color}, x: labels, y: rangeData});
    }
    setGraphDataFinal({data: graphDataFinal.data, data2: graphDataSets, labels: graphDataFinal.labels});
  }

  React.useEffect(() => {
    GetGraphList();
  }, [])

  function GetGraphList() {
    var url = SERVERIP + 'getgraphs';
    fetch(url, {
        headers: {
          'Authorization': localStorage.getItem('session-id')
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then(res => res.json())
        .then(
          (result) => {
            if (result.Success) {
              setGraphList(result.Data);
            } else {
              if (result.Error == "Bad token") {
                setMyState({SessionError: true})
                setTimeout(() => setMyState({SessionError: false}), 3000);
                return
              }
            }
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            console.log(error);
          }
        )
    return
  }

  function ViewPastGraph(id) {
    setMyState({Loading: true})
    var postBody = {
      ID: id,
    };
    var url = SERVERIP + 'graph'
    fetch(url, {
      method: 'post',
      body: JSON.stringify(postBody),
      headers: {
        'Authorization': localStorage.getItem('session-id')
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then(response => response.json())
    .then(json => {
      if (json.Success) {
        DrawGraph(json.Data.GraphData.data, json.Data.GraphData.labels);
      } else {
        if (json.Error == "Bad token") {
          setMyState({SessionError: true, Loading: false})
          setTimeout(() => setMyState({SessionError: false}), 3000);
          return
        }
      }
    });
  }

  function DeleteGraphPost(id) {
    setMyState({Loading: true})
    var url = SERVERIP + 'deletegraph'
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
      if (json.Success) {
        setMyState({GraphDeleted: true, Loading: false});
        GetGraphList()
        setTimeout(() => setMyState({GraphDeleted: false}), 3000);
      } else {
          if (json.Error === "Bad token") {
            setMyState({SessionError: true, Loading: false})
            setTimeout(() => setMyState({SessionError: false}), 3000);
            return
          }
      }
    });
  }

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

  function GraphListFunc() {
    if (graphList != null) {
      return graphList.map((graph, index) => { return ( <tr key={index}><td>{graph._id}</td><td>{graph.Timestamp}</td><td><Tooltip2 title="View Graph"><a onClick={() => ViewPastGraph(graph._id)} href="#"><img className="icon" src="images/eye-arrow-right.png"></img></a></Tooltip2></td><td><Tooltip2 title="Delete Graph"><a onClick={() => DeleteGraphPost(graph._id)} href="#"><img className="icon" src="images/delete.png"></img></a></Tooltip2></td></tr>)})
    } else {
      return <tr><td>No graphs in database</td><td></td><td></td><td></td></tr>
    }
  }

  function toggleFullscreen() {
    setPlotSize({width: window.screen.width, height: window.screen.height});
    document.getElementById("myPlot").requestFullscreen().catch(console.log());

    var el = document.getElementById('myPlot');
    el.addEventListener('fullscreenchange', fullscreenchanged);
  }

  function fullscreenchanged(event) {
    // document.fullscreenElement will point to the element that
    // is in fullscreen mode if there is one. If not, the value
    // of the property is null.
    if (document.fullscreenElement) {
      console.log(`Element: ${document.fullscreenElement.id} entered fullscreen mode.`);
    } else {
      console.log('Leaving fullscreen mode.');
      setPlotSize({width: 1100, height: 700});
    }
  };

  function rangeStartFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
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

  function rangeStopFunction() {
    document.getElementById("myDropdown2").classList.toggle("show");
  }
  
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
  
  return (
    <div>
      {myState.Loading ? <AlertSnackbar open={true} message="Loading" severity="warning"/> : null}
      {myState.FileError ? <AlertSnackbar open={true} message="Error reading file! See About & Help" severity="error"/> : null}
      {myState.FileExtError ? <AlertSnackbar open={true} message="Unsupported file type! csv or xlsx only" severity="error"/> : null}
      {myState.SessionError ? <AlertSnackbar open={true} message="Session has expired! Login again" severity="error"/> : null}
      {myState.GraphDeleted ? <AlertSnackbar open={true} message="Graph deleted!" severity="success"/> : null}
      {myState.isUploaded ? <div className="fullscreen"><br></br><br></br><a onClick={toggleFullscreen} href="#"><Tooltip2 title="Enter Fullscreen"><img className="icon" src="images/fullscreen.png"></img></Tooltip2></a></div> : null}
      
      {myState.isUploaded ? <div className="fullscreen"><div class="dropdown">
            <button onClick={rangeStartFunction} class="dropbtn">Range Start</button>
            <div id="myDropdown" class="dropdown-content">
              <input type="text" placeholder="Search.." id="rangeStartInput" onKeyUp={rangeStartFilter}/>
              {graphDataFinal.labels.map((label, index) => { return ( <a key={index} onClick={() => setRangeStart(index)}>{label}</a> )})}
            </div>
          </div>
          <div class="dropdown">
            <button onClick={rangeStopFunction} class="dropbtn">Range Stop</button>
            <div id="myDropdown2" class="dropdown-content">
              <input type="text" placeholder="Search.." id="rangeStopInput" onKeyUp={rangeStopFilter}/>
              {graphDataFinal.labels.map((label, index) => { return ( <a key={index} onClick={() => setRangeStop(index)}>{label}</a> )})}
            </div>
          </div>
          <input className="add-user" type="submit" value="VIEW RANGES" onClick={() => GraphRange(rangeStart, rangeStop)}/>
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