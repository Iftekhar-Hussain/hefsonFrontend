import React from "react";
import Highcharts from "highcharts/highstock";
import moment from "moment";
import HighchartsReact from "highcharts-react-official";
// import { format, parse } from "date-fns";

const TempHumiditySensor = ({ historyData, pickup, delivery, temperature }) => {
  // console.log("historyData =. ", historyData, pickup, delivery);
  // console.log(historyData.slice(-1)[0], "element");

  // Calculate the timestamp for 6 hours before the first data point
  const firstDataPointTime =
    historyData && historyData.length > 0 && historyData[0]?.GT
      ? new Date(historyData[0]?.GT).getTime()
      : 0;
  const sixHoursBeforeFirstDataPoint = firstDataPointTime - 6 * 60 * 60 * 1000;

  // Calculate the timestamp for 6 hours after the last data point
  const lastDataPointIndex = historyData?.length - 1;
  const lastDataPointTime =
    lastDataPointIndex >= 0
      ? new Date(historyData[lastDataPointIndex].GT)?.getTime()
      : 0;
  const sixHoursAfterLastDataPoint = lastDataPointTime + 6 * 60 * 60 * 1000;

  // Calculate the start of the year
  // const currentYear = moment().year();
  // const startOfYear = moment({ year: currentYear, month: 0, day: 1 }).toDate();
  // const minDate = historyData.length > 0 ? new Date(historyData[0].GT) : null;
  // const maxDate =
  //   historyData.length > 0
  //     ? new Date(historyData[historyData.length - 1].GT)
  //     : null;

  const options = {
    chart: {
      type: "area",
      backgroundColor: "#f7f7f7",
      height: "600px",
    },
    rangeSelector: {
      enabled: true,
      inputEnabled: true,
      buttonTheme: {
        visibility: "hidden", // Hide the default buttons
      },
      labelStyle: {
        color: "black", // Color of the selected range label
        backgroundColor: "#f7f7f7", // Background color of the selected range label
        shape: "rect", // Shape of the label background
      },

      inputBoxBorderColor: "#106b41", // Color of the input box border "#106b41"
      inputBoxWidth: 120, // Width of the input box
      inputStyle: {
        color: "black", // Color of the text in the input box
        backgroundColor: "f7f7f7",
      },
      labelFormatter: function () {
        const startDate = Highcharts.dateFormat("%b %e, %Y", this.min);
        const endDate = Highcharts.dateFormat("%b %e, %Y", this.max);
        return startDate + " - " + endDate;
      },
    },
    xAxis: {
      type: "datetime",
      labels: {
        formatter: function () {
          return Highcharts.dateFormat("%H:%M", this.value);
        },
      },
    },
    yAxis: {
      title: {
        text: null,
      },
      labels: {
        enabled: false, // Hide y-axis labels
      },
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.y:.1f}</b>",
    },

    plotOptions: {
      area: {
        stacking: "normal",
        lineColor: "#666666",
        lineWidth: 1,
        marker: {
          enabled: false,
        },
      },
    },
    series: [
      {
        name: "Temperature",
        data: [
          // [sixHoursBeforeFirstDataPoint, null], // Add null data point for start
          ...historyData.map((data) => [
            new Date(data.GT).getTime(),
            data.Temp1,
          ]),
          // [sixHoursAfterLastDataPoint, null], // Add null data point for end
        ],
        color: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, "#ffffff"], // End color (blue)
            [1, "rgba(255, 255, 255, 0.2)"], // Start color (white)
          ],
        },
        fillOpacity: 0.5,
      },
      {
        name: "Humidity",
        data: [
          // [sixHoursBeforeFirstDataPoint, null], // Add null data point for start
          ...historyData.map((data) => [
            new Date(data.GT).getTime(),
            data.Hum1,
          ]),
          // [sixHoursAfterLastDataPoint, null], // Add null data point for end
        ],
        color: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, "#0edd7e"], // End color (black)
            [1, "rgba(255, 255, 255, 0.2)"], // Start color (white)
          ],
        },
        fillOpacity: 0.2,
      },
    ],
  };

  return (
    <div className="col-12" style={{ width: "100%" }}>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"stockChart"}
        options={options}
      />
    </div>
  );
};

export default TempHumiditySensor;
