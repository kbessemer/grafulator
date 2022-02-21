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
  var graphDataSets = [];

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
            DrawGraph(result.data, result.labels);
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
    console.log("Draw Graph Executed")
    setGraphLabels(labels);
    console.log(data);
    for (var x in data) {
      if (x != 0) {
        console.log(x)
        console.log(data[x].label)
        graphDataSets.push({ id: x, label: data[x].label, data: data[x].data, borderColor: data[x].borderColor, backgroundColor: data[x].backgroundColor })
      }
    }
    setGraphDataFinal(graphDataSets);
    console.log(graphDataFinal);
  }

  return (
    <div>
      {isUploaded ? null : <div id="drop_zone" onDrop={dropHandler} onDragOver={dragOverHandler}>
        <p className="drop_zone">Drag one or more files to upload and generate a graph</p>
      </div>}
      <br></br>
        {isUploaded ? <div className="graph-area"><Line
          datasetIdKey='myLine'
          data={{
            labels: graphLabels,
            datasets: graphDataFinal,
          }}
        /></div> : null}
    </div>
    )
}

export default UploadFile