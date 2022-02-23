import React from 'react';
import { Line } from 'react-chartjs-2';
import Tooltip2 from '@mui/material/Tooltip';
import AlertSnackbar from './alerts/AlertSnackbar';
import Plot from 'react-plotly.js';
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
  const [graphLabels, setGraphLabels] = React.useState(null);
  const [isUploaded, setIsUploaded] = React.useState(false);
  const [graphList, setGraphList] = React.useState([]);
  const [myState, setMyState] = React.useState({});

  function dropHandler(ev) {
    console.log('File(s) dropped');
  
    // Prevent default behavior (Prevent file from being opened)
    if (ev.dataTransfer.items) {
        // If dropped items aren't files, reject them
        if (ev.dataTransfer.items[0].kind === 'file') {
          var file = ev.dataTransfer.items[0].getAsFile();
          var data = new FormData()
          data.append('file', file)

          fetch('http://192.168.1.94:8081/upload', {
            method: 'post',
            body: data,
            headers: {
              'Authorization': localStorage.getItem('session-id')
            },
        }).then(response => response.json())
        .then(
          (result) => {
            DrawGraph(result.data.data, result.data.labels);
            setIsUploaded(true);
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
    ev.preventDefault();
    }

  function dragOverHandler(ev) {
    console.log('File(s) in drop zone');
  
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  }

  function DrawGraph(data, labels) {
    var graphDataSets = [];
    console.log("Draw Graph Executed")
    setGraphLabels(labels);
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
    setGraphLabels(labels);
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
    fetch("http://192.168.1.94:8081/getgraphs", {
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
  }

  function ViewPastGraph(id) {
    var postBody = {
      ID: id,
    };
    fetch('http://192.168.1.94:8081/graph', {
      method: 'post',
      body: JSON.stringify(postBody),
      headers: {
        'Authorization': localStorage.getItem('session-id')
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then(response => response.json())
    .then(json => {
      if (json.Success) {
        DrawGraph2(json.Data.GraphData.data, json.Data.GraphData.labels);
        setIsUploaded(true);
      }
    });
  }

  function DeleteGraphPost(id) {
    setMyState({Loading: true})
    fetch('http://192.168.1.94:8081/deletegraph', {
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

  return (
    <div>
      {myState.SessionError ? <AlertSnackbar open={true} message="Session has expired! Login again" severity="error"/> : null}
      {myState.GraphDeleted ? <AlertSnackbar open={true} message="Graph deleted!" severity="success"/> : null}
      {isUploaded ? null : <div id="dropZone" onDrop={dropHandler} onDragOver={dragOverHandler}>
        <p className="dropZone">Drag one or more files to upload and generate a graph</p>
      </div>}
        {isUploaded ? <Plot
          data={graphDataFinal}
          layout={ {width: 900, height: 500, title: ''} }
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
              {graphList.map((graph, index) => { return ( <tr key={index}><td>{graph._id}</td><td>{graph.Timestamp}</td><td><Tooltip2 title="View Graph"><a onClick={() => ViewPastGraph(graph._id)} href="#"><img className="icon" src="images/eye-arrow-right.png"></img></a></Tooltip2></td><td><Tooltip2 title="Delete Graph"><a onClick={() => DeleteGraphPost(graph._id)} href="#"><img className="icon" src="images/delete.png"></img></a></Tooltip2></td></tr>)})}
            </tbody>
          </table></div>}
    </div>
    )
}

export default UploadFile