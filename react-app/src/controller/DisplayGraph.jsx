// GRAFULATOR
// Last Modified: May 17, 2022
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
function DisplayGraph(props) {

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

  // Function for toggling full screen mode for the graph
  function toggleFullscreen() {
    // Adjust react hook, set graph size to user's resolution
    props.setPlotSize({width: window.screen.width, height: window.screen.height});
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
      props.setPlotSize({width: 1100, height: 700});
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

  // Function for the resolution dropdown
  function resFunction() {
    document.getElementById("myDropdown4").classList.toggle("show");
  }

  // Function for the staistics dropdown
  function statSettingFunction() {
    document.getElementById("myDropdown5").classList.toggle("show");
  }

  function handleFormula(event) {
    setFormula(event.target.value);
    props.setStatistic("formula");
    if (event.target.value === "") {
      setFormula(null);
    }
  }
  
  // Return statement for the upload file component, consists of alerts, graph when data is present, upload file drop zone,
  // graph options such as statistics and range, and graph history from the database
  return (
    <div>
      {props.myState.isUploaded ? <div className="left-margin"><br></br><br></br><a onClick={toggleFullscreen} href="#"><Tooltip2 title="Enter Fullscreen"><img className="icon" src="images/fullscreen.png"></img></Tooltip2></a></div> : null}
      {props.myState.isUploaded ? <div className="left-margin"><div class="dropdown">
            <button onClick={rangeStartFunction} className="dropbtn">RANGE START</button>
            <div id="myDropdown" class="dropdown-content">
              <input type="text" placeholder="Search.." id="rangeStartInput" onKeyUp={rangeStartFilter}/>
              {props.graphDataFinal.labels.map((label, index) => { return ( <a key={index} href="#" onClick={() => setRangeStart(index)}>{index}: {label}</a> )})}
            </div>
          </div>
          <div class="dropdown">
            <button onClick={rangeStopFunction} className="dropbtn">RANGE STOP</button>
            <div id="myDropdown2" class="dropdown-content">
              <input type="text" placeholder="Search.." id="rangeStopInput" onKeyUp={rangeStopFilter}/>
              {props.graphDataFinal.labels.map((label, index) => { return ( <a key={index} href="#" onClick={() => setRangeStop(index)}>{index}: {label}</a> )})}
            </div>
          </div>
          <button onClick={() => props.GraphRange(rangeStart, rangeStop)} className="dropbtn">VIEW RANGES</button>
          <button onClick={() => props.ResetRanges()} className="dropbtn">RESET RANGES</button>
          <button onClick={() => props.ChangeColors()} className="dropbtn">CHANGE COLORS</button>
        </div> : null}
      <br/><br/>
      {props.graphDataFinal.range ? <div className="left-margin"><div class="dropdown">
            <button onClick={statFunction} class="dropbtn">VIEW STATISTICS</button>
            <div id="myDropdown3" class="dropdown-content">
              <input type="text" placeholder="Search.." id="statInput" onKeyUp={statFilter}/>
              {props.graphDataFinal.yLabels.map((label, index) => { return ( <a key={index} href="#" onClick={() => props.CalcStats(index, label)}>{label}</a> )})}
            </div>
          </div>
          <div class="dropdown">
            <button onClick={statSettingFunction} class="dropbtn">SET STATISTIC</button>
            <div id="myDropdown5" class="dropdown-content">
              <a href="#" onClick={() => props.setStatistic("mean")}>Mean</a>
              <a href="#" onClick={() => props.setStatistic("median")}>Median</a>
              <input type="text" placeholder="Custom formula..." id="formulaInput" onChange={handleFormula}/>
            </div>
          </div>
          <div class="dropdown">
            <button onClick={resFunction} class="dropbtn">SET RESOLUTION</button>
            <div id="myDropdown4" class="dropdown-content">
              {props.resolutions.map((resolution, index) => { return ( <a key={index} href="#" onClick={() => props.ResolutionRange(rangeStart, rangeStop, resolution, formula)}>{resolution} seconds</a> )})}
            </div>
          </div>
        </div> : null}

      {props.graphDataFinal.stats ? <Modal
            open={props.statsOpen}
            onClose={handleCloseStats}
          >
          <Box sx={{ ...style}}>
          <div className="stats-modals">
            <table>
              <thead>
              </thead>
              <tbody>
                <tr className="stat-tr"><td><strong>Minimum:</strong></td><td>{props.statData.minimum}</td></tr>
                <tr className="stat-tr"><td><strong>Maximum:</strong></td><td>{props.statData.maximum}</td></tr>
                <tr className="stat-tr"><td><strong>Range:</strong></td><td>{props.statData.range}</td></tr>
                <tr className="stat-tr"><td><strong>Mean:</strong></td><td>{props.statData.mean}</td></tr>
                <tr className="stat-tr"><td><strong>Median:</strong></td><td>{props.statData.median}</td></tr>
                <tr className="stat-tr"><td><strong>Mode:</strong></td><td>{props.statData.mode}</td></tr>
                <tr className="stat-tr"><td><strong>Variance:</strong></td><td>{props.statData.variance}</td></tr>
                <tr className="stat-tr"><td><strong>Standard Deviation:</strong></td><td>{props.statData.stddev}</td></tr>
                <tr className="stat-tr"><td><strong>Coefficient of Variation:</strong></td><td>{props.statData.co}</td></tr>
                <tr className="stat-tr"><td><strong>25 Percentile</strong></td><td>{props.statData.quartiles[0]}</td></tr>
                <tr className="stat-tr"><td><strong>75 Percentile</strong></td><td>{props.statData.quartiles[1]}</td></tr>
              </tbody>
            </table>
          </div>
          </Box>
          </Modal> : null}

      {props.myState.isUploaded ? <div id="myPlot"><Plot
          data={props.graphDataFinal.res ? props.graphDataFinal.data3 : props.graphDataFinal.data2}
          layout={ {font: {color: props.theme2 === false ? '#000' : '#fff'}, plot_bgcolor: props.theme2 === false ? '#fff' : '#282c34', paper_bgcolor: props.theme2 === false ? '#fff' : '#282c34', width: props.plotSize.width, height: props.plotSize.height, title: '', xaxis: {'type': 'date'}} }
        /><br></br><br></br></div> : null}
    </div>
    )
}

export default DisplayGraph