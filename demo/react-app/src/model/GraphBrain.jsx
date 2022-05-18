// GRAFULATOR
// Last Modified: May 17, 2022
// Authored and Developed by: Kyle Bessemer
// LinkedIn: https://www.linkedin.com/in/kyle-bessemer-606a7a1b2/
// GitHub: https://github.com/kbessemer

import Statistics from 'statistics.js';
import { evaluate } from 'mathjs';

// Function for creating the graph
export function DrawGraph(data, labels) {
    var pointers = {
      time: 1000,
      label: 30,
    }
    var test = evaluate('time / label', pointers);
    var graphDataSets = [];
    var dateLabels = {
      format: '',
      labels: [],
    };
    var labels2 = [];

    if (labels[0].search("-") === -1 && labels[0].search("/") === -1) {
      console.log("Inside epoch")
      if (labels[0].length === 10) {
        dateLabels.format = 'seconds';
      } else if (labels[0].length === 13) {
        dateLabels.format = 'milliseconds';
      } else {
        dateLabels.format = 'nanoseconds';
      }
      for (var x in labels) {
        dateLabels.labels.push(labels[x]);
      }
    } else {
      console.log("Outside epoch")
      var timestamp = new Date(labels[0]);
      timestamp = timestamp.getTime().toString()
      if (timestamp.length === 10) {
        dateLabels.format = 'seconds';
      } else if (timestamp.length === 13) {
        dateLabels.format = 'milliseconds';
      } else {
        dateLabels.format = 'nanoseconds';
      }
      for (var x in labels) {
        timestamp = new Date(labels[x]);
        dateLabels.labels.push(timestamp.getTime().toString());
      }
    }
    var hour = dateLabels.labels[0].toLocaleString("en-US", {hour: "numeric"})
    var minute = dateLabels.labels[0].toLocaleString("en-US", {minute: "numeric"})
    var seconds = dateLabels.labels[0].toLocaleString("en-US", {second: "numeric"})

    if (labels[0].search("-") === -1 && labels[0].search("/") === -1) {
      for (var x in labels) {
        labels2.push(labels[x]);
      }
    } else {
      for (var x in labels) {
        var timestamp = new Date(labels[x]);
        timestamp = timestamp.getTime().toString();
        labels2.push(timestamp);
      }
    }

    // Iterate over the data in api response
    for (var x in data) {
      // Choose a random color for each line
      const randomColor = Math.floor(Math.random()*16777215).toString(16);
      var color = "#" + randomColor;
      // Create a data entry for each line
      graphDataSets.push({type: 'line', name: data[x].label, mode: 'lines+markers', marker: {color: color}, x: labels2, y: data[x].data});
    }
    // Adjust react hooks
    return {data: graphDataSets, data2: graphDataSets, labels: labels2, dateLabels: dateLabels};
  }

  // Function for choosing a range in the graph
  export function GraphRange(start, stop, graphDataFinal) {
    // if (start === null || stop === null) {
    //   setMyState({BlankRangeError: true, Loading: false, isUploaded: true});
    //   setTimeout(() => setMyState({BlankRangeError: false, Loading: false, isUploaded: true}), 3000);
    //   return
    // }
    // if (start > stop) {
    //   setMyState({RangeError: true, Loading: false, isUploaded: true});
    //   setTimeout(() => setMyState({RangeError: false, Loading: false, isUploaded: true}), 3000);
    //   return
    // }
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

    var format = graphDataFinal.dateLabels.format;

    for (var x in graphDataFinal.dateLabels.labels) {
      var tempStop = start + 1;
      var minimum = 999999999999;
      if (tempStop > stop) {
        break
      }
      var difference = parseInt(graphDataFinal.dateLabels.labels[tempStop]) - parseInt(graphDataFinal.dateLabels.labels[start])
      if (difference < minimum) {
        minimum = difference;
      }
    }

    if (format === 'milliseconds') {
      minimum /= 1000;
    } else if (format === 'nanoseconds') {
      minimum /= 1000000000;
    }

    var tempRes = [];
    tempRes.push(0);
    tempRes.push(minimum * 2);
    tempRes.push(minimum * 3);
    tempRes.push(minimum * 4);

    // setResolutions(tempRes);

    // Adjust react hook
    // setGraphDataFinal({data: graphDataFinal.data, data2: graphDataSets, labels: graphDataFinal.labels, dateLabels: graphDataFinal.dateLabels, yLabels: yLabels, range: true, stats: false});
    return {data: graphDataSets, yLabels: yLabels, tempRes: tempRes};
  }

  // Function for the statistics summary for the selected range
  export function CalcStats(index, label, graphDataFinal) {
    // setStatLabel({index: index, label: label});
    var data = [];
    var statLength = graphDataFinal.data2[index].y.length - 1
    // Iterate over graph data, create a data array with values
    for (var x = 0; x <= statLength; x++) {
      data.push({ID: x, value: parseFloat(graphDataFinal.data2[index].y[x])})
    }
    // Adjust react hook
    // setGraphDataFinal({data: graphDataFinal.data, data2: graphDataFinal.data2, labels: graphDataFinal.labels, dateLabels: graphDataFinal.dateLabels, yLabels: graphDataFinal.yLabels, range: true, stats: true})

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
    return {minimum: stats.minimum("value"), maximum: stats.maximum("value"), range: stats.range("value"), mean: stats.mean("value"), median: stats.median("value"), mode: stats.mode("value"), variance: stats.variance("value"), stddev: stats.standardDeviation("value"), co: stats.coefficientOfVariation("value"), quartiles: stats.quartiles("value")};
  }

  // Function for choosing a resolution
  export function ResolutionRange(start, stop, res, formula, statLabel, graphDataFinal, statistic) {
    // if (statLabel === null) {
    //   setMyState({labelError: true, Loading: false, isUploaded: true});
    //   setTimeout(() => setMyState({labelError: false, Loading: false, isUploaded: true}), 3000);
    //   return
    // }
    // if (statistic === null) {
    //   setMyState({statisticError: true, Loading: false, isUploaded: true});
    //   setTimeout(() => setMyState({statisticError: false, Loading: false, isUploaded: true}), 3000);
    //   return
    // }
    var value = statLabel.index;
    var graphDataSets = [];
    var data = [];
    var values = [];
    var resTimestamp = [];
    var counter = 1;
    var tempTime = '';

    if (res != 0) {
      var format = graphDataFinal.dateLabels.format;
      if (format === 'milliseconds') {
        res *= 1000;
      } else if (format === 'nanoseconds') {
        res *= 1000000000;
      }

      var startSeconds = graphDataFinal.dateLabels.labels[start];

      startSeconds = parseInt(startSeconds);
      var maxSeconds = startSeconds + res;
      graphDataSets.push(graphDataFinal.data2[value]);

      tempTime = parseInt(graphDataFinal.data2[value].x);

      function getValues() {
        for (var z in graphDataFinal.data2[value].x) {
          var tempSeconds = parseInt(graphDataFinal.data2[value].x[z]);
          if (startSeconds <= tempSeconds && tempSeconds <= maxSeconds) {
            console.log("Found seconds within resolution")
            data.push({ID: counter, value: parseFloat(graphDataFinal.data2[value].y[z])});
            counter += 1;
          }
        }

        if (formula === null) {
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

          if (statistic === "median") {
            values.push(stats.median("value"));
          } else if (statistic === "mean") {
            values.push(stats.mean("value"));
          } else if (statistic === "mode") {
            values.push(stats.mode("value"));
          }
        } else {
          var sum = 0;
          var counter = 0;
          for (var x in data) {
            sum += data[x].value;
            counter += 1;
          }
          var avg = sum / counter;
          var pointer = {x: avg};
          var val = evaluate(formula, pointer)
          values.push(val);
        }

        resTimestamp.push(tempTime);
        data = [];

        startSeconds += res;
        maxSeconds += res;
        tempTime += res;

        if (startSeconds <= tempSeconds) {
          getValues();
        }

      }

      if (graphDataFinal.data2[value].x[0].search("-") === -1) {
        console.log("Found epoch time")
        getValues();
        const randomColor = Math.floor(Math.random()*16777215).toString(16);
        var color = "#" + randomColor;
        graphDataSets.push({type: 'line', name: formula === null ? statistic : formula, mode: 'lines+markers', marker: {color: color}, x: resTimestamp, y: values});
      } 
    } else {
      graphDataSets.push(graphDataFinal.data2[value]);

      for (var z = start; z <= stop; z++) {
        resTimestamp.push(graphDataFinal.data2[value].x[z])
        var pointer = {x: parseFloat(graphDataFinal.data2[value].y[z])}
        var val = evaluate(formula, pointer)
        values.push(val);
      }

      if (graphDataFinal.data2[value].x[0].search("-") === -1) {
        console.log("Found epoch time")
        const randomColor = Math.floor(Math.random()*16777215).toString(16);
        var color = "#" + randomColor;
        graphDataSets.push({type: 'line', name: formula === null ? statistic : formula, mode: 'lines+markers', marker: {color: color}, x: resTimestamp, y: values});
      } 
    }

    // Adjust react hook
    // setGraphDataFinal({data: graphDataFinal.data, data2: graphDataFinal.data2, data3: graphDataSets, labels: graphDataFinal.labels, dateLabels: graphDataFinal.dateLabels, yLabels: graphDataFinal.yLabels, range: true, stats: true, res: true});
    return {data: graphDataSets}
  }
