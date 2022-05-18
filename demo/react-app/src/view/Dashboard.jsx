// GRAFULATOR
// Last Modified: May 17, 2022
// Authored and Developed by: Kyle Bessemer
// LinkedIn: https://www.linkedin.com/in/kyle-bessemer-606a7a1b2/
// GitHub: https://github.com/kbessemer

import React from 'react';
import UploadFile from "../controller/UploadFile";
import DisplayGraph from '../controller/DisplayGraph';
import GetUsers from '../controller/GetUsers';
import MyAppBar from '../controller/AppBar';
import PasswordMgr from '../controller/MyPassword';
import { DrawGraph, GraphRange, CalcStats, ResolutionRange } from '../model/GraphBrain';
import SERVERIP from '../constants.js';

// Dashboard component
function Dashboard(props) {
  const [graphDataFinal, setGraphDataFinal] = React.useState({});
  const [graphList, setGraphList] = React.useState([]);
  const [myState, setMyState] = React.useState({});
  const [plotSize, setPlotSize] = React.useState({});
  const [statData, setStatData] = React.useState({});
  const [statLabel, setStatLabel] = React.useState(null);
  const [statsOpen, setStatsOpen] = React.useState(false);
  const [statistic, setStatistic] = React.useState(null);
  const [resolutions, setResolutions] = React.useState([]);

  function ResetRanges() {
    setGraphDataFinal({data: graphDataFinal.data, data2: graphDataFinal.data, labels: graphDataFinal.labels, dateLabels: graphDataFinal.dateLabels});
  }

  function DrawGraphHandler(data, labels) {
    var results = DrawGraph(data, labels);
    setPlotSize({width: 1100, height: 700});
    setGraphDataFinal({data: results.data, data2: results.data2, labels: results.labels, dateLabels: results.dateLabels, stats: false});
    setMyState({Loading: false, isUploaded: true})
  }

  function GraphRangeHandler(start, stop) {
    var results = GraphRange(start, stop, graphDataFinal);
    setResolutions(results.tempRes);
    setGraphDataFinal({data: graphDataFinal.data, data2: results.data, labels: graphDataFinal.labels, dateLabels: graphDataFinal.dateLabels, yLabels: results.yLabels, range: true, stats: false});
  }

  function CalcStatsHandler(index, label) {
    setStatLabel({index: index, label: label});
    var results = CalcStats(index, label, graphDataFinal);
    setGraphDataFinal({data: graphDataFinal.data, data2: graphDataFinal.data2, labels: graphDataFinal.labels, dateLabels: graphDataFinal.dateLabels, yLabels: graphDataFinal.yLabels, range: true, stats: true});
    setStatData({minimum: results.minimum, maximum: results.maximum, range: results.range, mean: results.mean, median: results.median, mode: results.mode, variance: results.variance, stddev: results.stddev, co: results.co, quartiles: results.quartiles})
    setStatsOpen(true);
  }

  function ResolutionRangeHandler(start, stop, res, formula) {
    if (statLabel === null) {
      setMyState({labelError: true, Loading: false, isUploaded: true});
      setTimeout(() => setMyState({labelError: false, Loading: false, isUploaded: true}), 3000);
      return
    }
    if (statistic === null) {
      setMyState({statisticError: true, Loading: false, isUploaded: true});
      setTimeout(() => setMyState({statisticError: false, Loading: false, isUploaded: true}), 3000);
      return
    }
    var results = ResolutionRange(start, stop, res, formula, statLabel, graphDataFinal, statistic);
    setGraphDataFinal({data: graphDataFinal.data, data2: graphDataFinal.data2, data3: results.data, labels: graphDataFinal.labels, dateLabels: graphDataFinal.dateLabels, yLabels: graphDataFinal.yLabels, range: true, stats: true, res: true});
  }

  function ChangeColors() {
    var graphDataSets = [];
    if (graphDataFinal.res) {
      for (var x in graphDataFinal.data3) {
        // Choose a random color for each line
        const randomColor = Math.floor(Math.random()*16777215).toString(16);
        var color = "#" + randomColor;
        // Create a data entry for each line
        graphDataSets.push({type: 'line', name: graphDataFinal.data3[x].name, mode: 'lines+markers', marker: {color: color}, x: graphDataFinal.data3[x].x, y: graphDataFinal.data3[x].y});
      }
      setGraphDataFinal({data: graphDataFinal.data, data2: graphDataFinal.data2, data3: graphDataSets, labels: graphDataFinal.labels, dateLabels: graphDataFinal.dateLabels, yLabels: graphDataFinal.yLabels, range: graphDataFinal.range, stats: graphDataFinal.stats, res: graphDataFinal.res});
    } else {
      for (var x in graphDataFinal.data2) {
        // Choose a random color for each line
        const randomColor = Math.floor(Math.random()*16777215).toString(16);
        var color = "#" + randomColor;
        // Create a data entry for each line
        graphDataSets.push({type: 'line', name: graphDataFinal.data2[x].name, mode: 'lines+markers', marker: {color: color}, x: graphDataFinal.data2[x].x, y: graphDataFinal.data2[x].y});
      }
      setGraphDataFinal({data: graphDataFinal.data, data2: graphDataSets, data3: graphDataFinal.data3, labels: graphDataFinal.labels, dateLabels: graphDataFinal.dateLabels, yLabels: graphDataFinal.yLabels, range: graphDataFinal.range, stats: graphDataFinal.stats, res: graphDataFinal.res});
    }
  }

  // Return statement, consists of the logo, navigation drawer, and uploadfile component
  return (
    <div>
      <MyAppBar setTheme={props.setTheme} theme={props.theme} theme2={props.theme2}/>
      <div className="Content-Row">
        <div className="dashboard">
          <DisplayGraph DrawGraph={DrawGraphHandler} ResetRanges={ResetRanges} setStatistic={setStatistic} ResolutionRange={ResolutionRangeHandler} GraphRange={GraphRangeHandler} CalcStats={CalcStatsHandler} ChangeColors={ChangeColors} setPlotSize={setPlotSize} setStatsOpen={setStatsOpen} plotSize={plotSize} graphList={graphList} statsOpen={statsOpen} statData={statData} resolutions={resolutions} myState={myState} graphDataFinal={graphDataFinal} setTheme={props.setTheme} theme={props.theme} theme2={props.theme2}/>
        </div>
      </div>
      <div className="Content-Row">
        <PasswordMgr myState={myState} theme2={props.theme2}/>
        {myState.isUploaded
          ? <div className="Content-Box-Left-Uploaded">
              <UploadFile DrawGraph={DrawGraphHandler} ResetRanges={ResetRanges} setStatistic={setStatistic} ResolutionRange={ResolutionRangeHandler} GraphRange={GraphRangeHandler} CalcStats={CalcStatsHandler} ChangeColors={ChangeColors} setPlotSize={setPlotSize} setStatsOpen={setStatsOpen} plotSize={plotSize} graphList={graphList} statsOpen={statsOpen} statData={statData} resolutions={resolutions} myState={myState} graphDataFinal={graphDataFinal} setTheme={props.setTheme} theme={props.theme} theme2={props.theme2}/>
            </div>
          : <div className="Content-Box-Left">
              <UploadFile DrawGraph={DrawGraphHandler} ResetRanges={ResetRanges} setStatistic={setStatistic} ResolutionRange={ResolutionRangeHandler} GraphRange={GraphRangeHandler} CalcStats={CalcStatsHandler} ChangeColors={ChangeColors} setPlotSize={setPlotSize} setStatsOpen={setStatsOpen} plotSize={plotSize} graphList={graphList} statsOpen={statsOpen} statData={statData} resolutions={resolutions} myState={myState} graphDataFinal={graphDataFinal} setTheme={props.setTheme} theme={props.theme} theme2={props.theme2}/>
            </div>}
        {myState.isUploaded
          ? <div className="Content-Box-Right-Uploaded">
              <GetUsers />
            </div>
          : <div className="Content-Box-Right">
              <GetUsers />
            </div>}
      </div>
    </div>
  );
}

export default Dashboard;
