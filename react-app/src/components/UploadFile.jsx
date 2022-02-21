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

  function dropHandler(ev) {
    console.log('File(s) dropped');
  
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  
    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (var i = 0; i < ev.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (ev.dataTransfer.items[i].kind === 'file') {
          var file = ev.dataTransfer.items[i].getAsFile();
          console.log('... file[' + i + '].name = ' + file.name);
          var data = new FormData()
          data.append('file', file)

          fetch('http://192.168.1.94:8081/upload', {
          method: 'post',
          body: data,
          headers: {
            'Authorization': localStorage.getItem('session-id')
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        }).then(response => response.json())
        .then(json => {
          if (json.Success) {
            console.log("File upload success");
        }});
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (var i = 0; i < ev.dataTransfer.files.length; i++) {
        console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
      }
    }
  }

  function dragOverHandler(ev) {
    console.log('File(s) in drop zone');
  
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  }

  var graphLabels = ["Jan", "Feb", "Mar", "Apr"]

  var graphData = [
    {
      label: "Kyle",
      data: [1500,1000,1200,1800],
      borderColor: "#00ff12",
      backgroundColor: "#00ff12"
    },
    {
      label: "Biprodeep",
      data: [3000,2000,3200,2800],
      borderColor: "#f6ff00",
      backgroundColor: "#f6ff00"
    }
  ]

  var graphDataSets = [];

  for (var x in graphData) {
    graphDataSets.push({ id: x, label: graphData[x].label, data: graphData[x].data, borderColor: graphData[x].borderColor, backgroundColor: graphData[x].backgroundColor })
  }

  return (
    <div>
      <div id="drop_zone" onDrop={dropHandler} onDragOver={dragOverHandler}>
        <p className="drop_zone">Drag one or more files to upload and generate a graph</p>
      </div>
      <br></br>
      <div className="graph-area">
        <Line
          datasetIdKey='myLine'
          data={{
            labels: graphLabels,
            datasets: graphDataSets,
          }}
        />
      </div>
    </div>
    )
}

export default UploadFile