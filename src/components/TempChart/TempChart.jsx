import React from "react";
import Highcharts from "highcharts/highstock";
import moment from "moment";
import HighchartsReact from "highcharts-react-official";
import { format, parse } from "date-fns";

const TempChart = ({ historyData, pickup, delivery, temperature }) => {
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
  const currentYear = moment().year();
  const startOfYear = moment({ year: currentYear, month: 0, day: 1 }).toDate();
  const minDate = historyData.length > 0 ? new Date(historyData[0].GT) : null;
  const maxDate =
    historyData.length > 0
      ? new Date(historyData[historyData.length - 1].GT)
      : null;

  const options = {
    chart: {
      type: "line",
      backgroundColor: "#f7f7f7",
      height: "400px",
    },
    // title: {
    //   text: `${moment(historyData?.slice(-1)[0]?.GT).format("hh:mm A")}
    //   </br>
    //   ${moment(historyData?.slice(-1)[0]?.GT).format("dddd D MMMM YYYY")}
    //   </br>
    //   <h6>
    //   Temperature: ${historyData?.slice(-1)[0]?.Temp1.toFixed(1)}F
    //   </h6>
    //   `,
    //   style: {
    //     fontSize: "14px",
    //   },
    // },
    rangeSelector: {
      enabled: true,
      inputEnabled: false,
      buttons: [],

      // buttons: [
      //   {
      //     type: "hour",
      //     count: 1,
      //     text: "1h",
      //   },
      //   {
      //     type: "day",
      //     count: 1,
      //     text: "1d",
      //   },
      //   {
      //     type: "week",
      //     count: 1,
      //     text: "1w",
      //   },
      //   {
      //     type: "month",
      //     count: 1,
      //     text: "1m",
      //   },
      //   {
      //     type: "ytd",
      //     text: "YTD",
      //   },
      //   {
      //     type: "all",
      //     text: "All",
      //   },
      // ],
      // selected: 2,
    },

    xAxis: {
      type: "datetime",
      // min: startOfYear, // Set the start of the year as the minimum value for the x-axis
      min: minDate ? minDate.getTime() : null,
      max: maxDate ? maxDate.getTime() : null,

      labels: {
        formatter: function () {
          return moment(this.value).format("hh:mm A");
        },
      },
      plotLines: [
        {
          color: "black", // Color value
          // dashStyle: "longdashdot", // Style of the plot line
          value: sixHoursBeforeFirstDataPoint, // Value of where the line will appear
          width: 3, // Width of the line
        },
        {
          color: "black", // Color value
          // dashStyle: "longdashdot", // Style of the plot line
          value: sixHoursAfterLastDataPoint, // Value of where the line will appear
          width: 3, // Width of the line
        },
      ],
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
      formatter: function () {
        if (this && this.points[0].point.customTooltip) {
          if (this.points[0].point.delivery) {
            return `
              <b>&nbsp;Delivery At</b><br/>
              <b>
                ${format(
                  parse(delivery?.deliveryTime, "HH:mm", new Date()),
                  "hh:mm a"
                )}
              </b>   
              ,              
              <b>
                ${moment(delivery?.deliveryDate).format("DD/MM/YYYY")}
              </b>
              <br/>
              <p className="destinaton">
                Set Temperature: ${this.y.toFixed(1)}F
              </p>
              <br/>
              <p className="destinaton">
                ${delivery?.deliveryAddress.split(",")[0]}, ${
              delivery?.deliveryAddress.split(",")[
                delivery?.deliveryAddress.split(",").length - 2
              ]
            }
              </p>             
              `;
          } else {
            return `
              <b>&nbsp;Pick Up</b><br/>
              <b>
                ${format(
                  parse(pickup?.pickupTime, "HH:mm", new Date()),
                  "hh:mm a"
                )}
              </b>   
              ,              
              <b>
                ${moment(pickup?.pickupDate).format("DD/MM/YYYY")}
              </b>
              <br/>
              <p className="destinaton">
                Set Temperature: ${this.y.toFixed(1)}F
              </p>
              <br/>
              <p className="destinaton">
                ${pickup?.pickupAddress.split(",")[0]}, ${
              pickup?.pickupAddress.split(",")[
                pickup?.pickupAddress.split(",").length - 2
              ]
            }
              </p>
              `;
          }
        } else {
          return `
          <b>
            ${moment(this.x).format("hh:mm A, D MMMM YYYY")}
          </b>
          <br/>
          Temperature: ${this.y.toFixed(1)}F
          `;
        }
      },
    },
    series: [
      {
        name: "Temperature",
        data: historyData?.map((data) => [
          new Date(data.GT).getTime(),
          data.Temp1,
        ]),
        color: "black",
      },
      {
        name: "Pickup and Delivery Point",
        data: [
          {
            x: sixHoursBeforeFirstDataPoint,
            y: parseInt(temperature),
            customTooltip: true,
          },
          {
            x: sixHoursAfterLastDataPoint,
            y: parseInt(temperature),
            customTooltip: true,
            delivery: true,
          },
        ],
        color: "rgba(0, 0, 0, 0.5)", // (black with 50% opacity)
        marker: {
          symbol: "circle",
        },
        dataLabels: {
          enabled: true,
          formatter: function () {
            if (this && this.customTooltip) {
              if (this.delivery) {
                return temperature + "F";
              } else {
                return temperature + "F";
              }
            } else if (this.x === sixHoursBeforeFirstDataPoint) {
              return "5F";
            }
            return null;
          },
          style: {
            color: "white",
          },
        },
        states: {
          hover: {
            lineWidthPlus: 3, // Increase the value to your desired line width
            lineColor: "black", // Replace 'black' with your desired color
          },
        },
        dashStyle: "dash", // Set the line style to dashed
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

export default TempChart;
