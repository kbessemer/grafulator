import React from 'react';
import { Line } from 'react-chartjs-2';
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
      console.log(data[x]);
      graphDataSets.push({ id: x, label: data[x].label, data: data[x].data, borderColor: data[x].borderColor, backgroundColor: data[x].backgroundColor })
    }
    setGraphDataFinal(graphDataSets);
  }

  function DrawGraph2(data, labels) {
    var graphDataSets = [];
    console.log("Draw Graph Executed")
    setGraphLabels(labels);
    for (var x in data) {
      console.log(data[x]);
      graphDataSets.push({ id: x, label: data[x].label, data: data[x].data, borderColor: data[x].bordercolor, backgroundColor: data[x].backgroundcolor })
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
      td = tr[i].getElementsByTagName("td")[0];
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
      {isUploaded ? null : <div id="dropZone" onDrop={dropHandler} onDragOver={dragOverHandler}>
        <p className="drop_zone">Drag one or more files to upload and generate a graph</p>
      </div>}
        {isUploaded ? <div className="graph-area"><Line
          datasetIdKey='myLine'
          data={{
            labels: graphLabels,
            datasets: graphDataFinal,
          }}
        /></div> : null}
        {isUploaded ? <a onClick={RefreshPage}>Load New Graph</a> : null}
        <br></br>
        {isUploaded ? null : <div><form className="formStyle8">
              <ul>
                <li>
                    <label htmlFor="myFilter">Search</label>
                    <input type="text" id="myFilter" onKeyUp={FilterTable}/>
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
              </tr>
            </thead>
            <tbody>
              {graphList.map((graph, index) => { return ( <tr key={index}><td>{graph._id}</td><td>{graph.Timestamp}</td><td><a onClick={() => ViewPastGraph(graph._id)}><img src="eye-arrow-right.png"></img></a></td></tr>)})}
            </tbody>
          </table></div>}
    </div>
    )
}

export default UploadFile