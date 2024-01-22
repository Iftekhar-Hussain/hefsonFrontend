import React from "react";
import Highcharts from "highcharts/highstock";
import moment from "moment";
import HighchartsReact from "highcharts-react-official";
import { format, parse } from "date-fns";

const TempHumidity = ({ historyData, pickup, delivery, temperature }) => {
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
      type: "area",
      backgroundColor: "#f7f7f7",
      height: "600px",
    },
    // title: {
    //   text: "Temperature & Humidity",
    // },
    xAxis: {
      type: "datetime",
      labels: {
        formatter: function () {
          return Highcharts.dateFormat("%H:%M", this.value);
        },
        style: {
          color: "black", // Color of the xAxis labels
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
      pointFormat: "{series.name}: <b>{point.y:.1f}F</b>",
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

    // rangeSelector: {
    //   enabled: true,
    //   inputEnabled: true,
    //   // buttonTheme: {
    //   //   visibility: 'hidden', // Hide the default buttons
    //   // },
    //   labelStyle: {
    //     color: 'black', // Color of the selected range label
    //   },
    //   inputBoxBorderColor: '#106b41', // Color of the input box border
    //   inputBoxWidth: 120, // Width of the input box
    //   inputStyle: {
    //     color: 'black', // Color of the text in the input box
    //   },
    //   buttons: [
    //     {
    //       type: 'day',
    //       count: 4,
    //       text: '4d',
    //       events: {
    //         click: function() {
    //           const chart = this.chart;
    //           const xAxis = chart.xAxis[0];
    //           const max = new Date('2023-07-12').getTime();
    //           const min = max - (4 * 24 * 60 * 60 * 1000);
    //           xAxis.setExtremes(min, max);
    //         }
    //       }
    //     },
    //     {
    //       type: 'day',
    //       count: 7,
    //       text: '1w',
    //       events: {
    //         click: function() {
    //           const chart = this.chart;
    //           const xAxis = chart.xAxis[0];
    //           const max = new Date('2023-07-12').getTime();
    //           const min = max - (7 * 24 * 60 * 60 * 1000);
    //           xAxis.setExtremes(min, max);
    //         }
    //       }
    //     },
    //     {
    //       type: 'day',
    //       count: 14,
    //       text: '2w',
    //       events: {
    //         click: function() {
    //           const chart = this.chart;
    //           const xAxis = chart.xAxis[0];
    //           const max = new Date('2023-07-12').getTime();
    //           const min = max - (14 * 24 * 60 * 60 * 1000);
    //           xAxis.setExtremes(min, max);
    //         }
    //       }
    //     }
    //   ],
    //   labelFormatter: function() {
    //     const startDate = Highcharts.dateFormat('%e %b %Y', this.min);
    //     const endDate = Highcharts.dateFormat('%e %b %Y', this.max);
    //     return startDate + ' to ' + endDate;
    //   },
    // },

    series: [
      {
        name: "Temperature",
        data: [
          [sixHoursBeforeFirstDataPoint, null], // Add null data point for start
          ...historyData.map((data) => [
            new Date(data.GT).getTime(),
            data.Temp1,
          ]),
          [sixHoursAfterLastDataPoint, null], // Add null data point for end
        ],
        color: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, "#106b41"], // End color (blue)
            [1, "rgba(255, 255, 255, 0.2)"], // Start color (white)
          ],
        },
        fillOpacity: 0.5,
      },
      {
        name: "Humidity",
        data: [
          [sixHoursBeforeFirstDataPoint, null], // Add null data point for start
          ...historyData.map((data) => [
            new Date(data.GT).getTime(),
            data.Hum1,
          ]),
          [sixHoursAfterLastDataPoint, null], // Add null data point for end
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

  // ...

  // const options = {
  //   chart: {
  //     type: "line",
  //     backgroundColor: "#f7f7f7",
  //     height: "400px",
  //   },
  //   // title: {
  //   //   text: `${moment(historyData?.slice(-1)[0]?.GT).format("hh:mm A")}
  //   //   </br>
  //   //   ${moment(historyData?.slice(-1)[0]?.GT).format("dddd D MMMM YYYY")}
  //   //   </br>
  //   //   <h6>
  //   //   Temperature: ${historyData?.slice(-1)[0]?.Temp1.toFixed(1)}F
  //   //   </h6>
  //   //   <h6>
  //   //   Humidity: ${historyData?.slice(-1)[0]?.Hum1.toFixed(1)}%
  //   //   </h6>
  //   //   `,
  //   //   style: {
  //   //     fontSize: "14px",
  //   //   },
  //   // },
  //   rangeSelector: {
  //     enabled: true,
  //     inputEnabled: false,
  //     buttons: [],
  //     // buttons: [
  //     //   {
  //     //     type: "hour",
  //     //     count: 1,
  //     //     text: "1h",
  //     //   },
  //     //   {
  //     //     type: "day",
  //     //     count: 1,
  //     //     text: "1d",
  //     //   },
  //     //   {
  //     //     type: "week",
  //     //     count: 1,
  //     //     text: "1w",
  //     //   },
  //     //   {
  //     //     type: "month",
  //     //     count: 1,
  //     //     text: "1m",
  //     //   },
  //     //   {
  //     //     type: "ytd",
  //     //     text: "YTD",
  //     //   },
  //     //   {
  //     //     type: "all",
  //     //     text: "All",
  //     //   },
  //     // ],
  //     selected: 2,
  //   },

  //   xAxis: {
  //     type: "datetime",
  //     // min: startOfYear, // Set the start of the year as the minimum value for the x-axis
  //     min: minDate ? minDate.getTime() : null,
  //     max: maxDate ? maxDate.getTime() : null,
  //     labels: {
  //       formatter: function () {
  //         return moment(this.value).format("hh:mm A");
  //       },
  //     },
  //     plotLines: [
  //       {
  //         color: "black", // Color value
  //         // dashStyle: "longdashdot", // Style of the plot line
  //         value: sixHoursBeforeFirstDataPoint, // Value of where the line will appear
  //         width: 3, // Width of the line
  //       },
  //       {
  //         color: "black", // Color value
  //         // dashStyle: "longdashdot", // Style of the plot line
  //         value: sixHoursAfterLastDataPoint, // Value of where the line will appear
  //         width: 3, // Width of the line
  //       },
  //     ],
  //   },
  //   yAxis: {
  //     title: {
  //       text: "Temperature(F) & Humidity(%) ",
  //     },
  //   },
  //   tooltip: {
  //     formatter: function () {
  //       // console.log(this, "------")
  //       if (this && this.points[0].point.customTooltip) {
  //         if (this.points[0].point.delivery) {
  //           return `
  //             <b>&nbsp;Delivery At</b><br/>
  //             <b>
  //               ${format(
  //                 parse(delivery?.deliveryTime, "HH:mm", new Date()),
  //                 "hh:mm a"
  //               )}
  //             </b>
  //             ,
  //             <b>
  //               ${moment(delivery?.deliveryDate).format("DD/MM/YYYY")}
  //             </b>
  //             <br/>
  //             <p className="destinaton">
  //               Set Temperature: ${this.y.toFixed(1)}F
  //             </p>
  //             <br/>
  //             <p className="destinaton">
  //               ${delivery?.deliveryAddress.split(",")[0]}, ${
  //             delivery?.deliveryAddress.split(",")[
  //               delivery?.deliveryAddress.split(",").length - 2
  //             ]
  //           }
  //             </p>
  //             `;
  //         } else {
  //           return `
  //             <b>&nbsp;Pick Up</b><br/>
  //             <b>
  //               ${format(
  //                 parse(pickup?.pickupTime, "HH:mm", new Date()),
  //                 "hh:mm a"
  //               )}
  //             </b>
  //             ,
  //             <b>
  //               ${moment(pickup?.pickupDate).format("DD/MM/YYYY")}
  //             </b>
  //             <br/>
  //             <p className="destinaton">
  //               Set Temperature: ${this.y.toFixed(1)}F
  //             </p>
  //             <br/>
  //             <p className="destinaton">
  //               ${pickup?.pickupAddress.split(",")[0]}, ${
  //             pickup?.pickupAddress.split(",")[
  //               pickup?.pickupAddress.split(",").length - 2
  //             ]
  //           }
  //             </p>
  //             `;
  //         }
  //       } else {
  //         return `
  //         <b>
  //           ${moment(this.x).format("hh:mm A, D MMMM YYYY")}
  //         </b>
  //         <br/>
  //         Temperature: ${this.y.toFixed(1)}F
  //         <br/>
  //         Humidity: ${this.points[1].y.toFixed(1)}%
  //         `;
  //       }
  //     },
  //   },

  //   plotOptions: {
  //     area: {
  //       states: {
  //         hover: {
  //           enabled: true,
  //           lineWidth: 0,
  //         },
  //       },
  //       marker: {
  //         enabled: false,
  //       },
  //       lineWidth: 1,
  //     },
  //   },

  //   series: [
  //     {
  //       name: "Temperature",
  //       type: "area",
  //       data: historyData.map((data) => [
  //         new Date(data.GT).getTime(),
  //         data.Temp1,
  //       ]),
  //       color: {
  //         linearGradient: {
  //           x1: 0,
  //           y1: 0,
  //           x2: 0,
  //           y2: 1,
  //         },
  //         stops: [
  //           [0, "rgba(173, 219, 154, 0.7)"], // Start color with higher opacity
  //           [1, "rgba(173, 219, 154, 0)"], // End color with lower opacity
  //         ],
  //       },
  //       fillOpacity: 0.7,
  //       lineWidth: 0,
  //       states: {
  //         hover: {
  //           enabled: true,
  //           lineWidth: 0,
  //         },
  //       },
  //     },

  //     {
  //       name: "Humidity",
  //       type: "area",
  //       data: historyData.map((data) => [
  //         new Date(data.GT).getTime(),
  //         data.Hum1,
  //       ]),
  //       color: {
  //         linearGradient: {
  //           x1: 0,
  //           y1: 0,
  //           x2: 0,
  //           y2: 1,
  //         },
  //         stops: [
  //           [0, "rgba(153, 217, 234, 0.7)"], // Start color with higher opacity
  //           [1, "rgba(153, 217, 234, 0)"], // End color with lower opacity
  //         ],
  //       },
  //       fillOpacity: 0.7,
  //       lineWidth: 0,
  //       states: {
  //         hover: {
  //           enabled: true,
  //           lineWidth: 0,
  //         },
  //       },
  //     },

  //     {
  //       name: "Pickup and Delivery Point",
  //       data: [
  //         {
  //           x: sixHoursBeforeFirstDataPoint,
  //           y: parseInt(temperature),
  //           customTooltip: true,
  //         },
  //         {
  //           x: sixHoursAfterLastDataPoint,
  //           y: parseInt(temperature),
  //           customTooltip: true,
  //           delivery: true,
  //         },
  //       ],
  //       color: "rgba(0, 0, 0, 0.5)", // (black with 50% opacity)
  //       marker: {
  //         symbol: "circle",
  //       },
  //       dataLabels: {
  //         enabled: true,
  //         formatter: function () {
  //           if (this && this.customTooltip) {
  //             if (this.delivery) {
  //               return temperature + "F";
  //             } else {
  //               return temperature + "F";
  //             }
  //           } else if (this.x === sixHoursBeforeFirstDataPoint) {
  //             return "5F";
  //           }
  //           return null;
  //         },
  //         style: {
  //           color: "white",
  //         },
  //       },
  //       states: {
  //         hover: {
  //           lineWidthPlus: 3, // Increase the value to your desired line width
  //           lineColor: "black", // Replace 'black' with your desired color
  //         },
  //       },
  //       dashStyle: "dash", // Set the line style to dashed
  //     },
  //   ],
  // };

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

export default TempHumidity;
