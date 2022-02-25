import React from 'react';
import { Line } from 'react-chartjs-2';
import Tooltip2 from '@mui/material/Tooltip';
import AlertSnackbar from './alerts/AlertSnackbar';
import Plot from 'react-plotly.js';
import SERVERIP from '../constants.js';
import Box from '@mui/material/Box';
import { LinearProgress } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Chart } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

function UploadFile() {

  const [graphDataFinal, setGraphDataFinal] = React.useState(null);
  const [isUploaded, setIsUploaded] = React.useState(false);
  const [graphList, setGraphList] = React.useState([]);
  const [myState, setMyState] = React.useState({});

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
              setMyState({Loading: false})
              DrawGraph(result.data.data, result.data.labels);
              setIsUploaded(true);
            } else {
              if (result.Error == 'Bad extension') {
                setMyState({FileExtError: true, Loading: false});
                setTimeout(() => setMyState({FileExtError: false}), 3000);
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
    console.log(typeof(labels[0]));
    for (var x in data) {
      const randomColor = Math.floor(Math.random()*16777215).toString(16);
      var color = "#" + randomColor;
      console.log(data[x]);
      graphDataSets.push({type: 'line', name: data[x].label, mode: 'lines+markers', marker: {color: color}, x: labels, y: data[x].data});
    }
    setGraphDataFinal(graphDataSets);
  }

  function DrawGraph2(data, labels) {
    var graphDataSets = [];
    console.log("Draw Graph Executed")
    console.log(typeof(labels[0]));
    for (var x in data) {
      const randomColor = Math.floor(Math.random()*16777215).toString(16);
      var color = "#" + randomColor;
      console.log(data[x]);
      graphDataSets.push({type: 'line', name: data[x].label, mode: 'lines+markers', marker: {color: color}, x: labels, y: data[x].data});
    }
    setGraphDataFinal(graphDataSets);
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
            setGraphList(result.Data);
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
        setMyState({Loading: false})
        DrawGraph2(json.Data.GraphData.data, json.Data.GraphData.labels);
        setIsUploaded(true);
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

  function RefreshPage() {
    window.location.reload();
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

  return (
    <div>
      {myState.Loading ? <AlertSnackbar open={true} message="Loading" severity="warning"/> : null}
      {myState.FileError ? <AlertSnackbar open={true} message="Error reading file! See About & Help" severity="error"/> : null}
      {myState.FileExtError ? <AlertSnackbar open={true} message="Unsupported file type! csv or xlsx only" severity="error"/> : null}
      {myState.SessionError ? <AlertSnackbar open={true} message="Session has expired! Login again" severity="error"/> : null}
      {myState.GraphDeleted ? <AlertSnackbar open={true} message="Graph deleted!" severity="success"/> : null}
      {isUploaded ? null : <div id="dropZone" onDrop={dropHandler} onDragOver={dragOverHandler}>
        <p className="dropZone">Drag one or more files to upload and generate a graph</p>
      </div>}
        {isUploaded ? <Plot
          data={graphDataFinal}
          layout={ {width: 1100, height: 700, title: '', xaxis: {'type': 'category'}} }
        /> : null}
        <br></br>
        {isUploaded ? <a onClick={RefreshPage} href="#">Load New Graph</a> : null}
        {isUploaded ? null : <div><form className="formStyle8">
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
          </table></div>}
    </div>
    )
}

export default UploadFile