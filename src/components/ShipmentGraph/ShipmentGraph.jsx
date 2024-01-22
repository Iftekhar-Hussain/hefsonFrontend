import React from "react";
import Moment from "react-moment";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Label,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { value } = payload[0];
    console.log("paylod dd  -- ", payload[0].payload.GT);
    // Customize the tooltip content based on your requirements
    // You can access other properties from the payload to further customize the content
    return (
      <div style={{ background: "white" }}>
        <div>
          {" "}
          Time:{" "}
          <Moment format="hh:mm A dddd  D, MMMM YYYY">
            {payload[0].payload.GT}
          </Moment>
        </div>
        {/* <div>{`Date: ${payload[0].payload.GT}`}</div> */}
        <div>{`Temperature: ${value.toFixed(1)}°F`}</div>
      </div>
    );
  }
  return null;
};

const ShipmentGraph = ({ historyData }) => {
  // const formatXAxisTime = (time) => {
  //     const date = new Date(time);
  //     const hours = date.getHours();
  //     return `${hours}h`;
  //   };
  const formatXAxisTime = (time, index) => {
    const counter = index + 1;
    return `${counter}h`;
  };

  return (
    <div className="col-12">
      <LineChart
        data={historyData}
        width={800}
        height={300}
        margin={{ top: 5, right: 300, left: 20, bottom: 5 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          xAxisId="0"
          dataKey="GT"
          interval={"preserveStartEnd"}
          axisLine={false}
          tickLine={false}
          tickFormatter={formatXAxisTime} // Custom tick formatter function
        >
          <Label value="Time" position="insideBottom" offset={-5} />
        </XAxis>
        <YAxis axisLine={false} tickLine={false}>
          <Label
            value="Temperature(in F)"
            position="insideLeft"
            angle={-90}
            offset={-5}
          />
        </YAxis>
        <Tooltip
          contentStyle={{ backgroundColor: "white" }}
          content={<CustomTooltip />}
        />
        <Line type="monotone" dataKey="Temp1" stroke="black" dot={{ r: 0 }} />
      </LineChart>
    </div>
  );
};

export default ShipmentGraph;
