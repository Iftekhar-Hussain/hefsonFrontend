import React from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import RadialSeparators from "./RadialSeparators";

const ProgressTempRed = ({ value, text, shipmentData }) => {
  // Calculate the progress percentage
  const progress = ((value - -20) / (40 - -20)) * 100;
  // Calculate the path and trail colors
  const pathColor = "#ffffff"; // White for progress
  const trailColor = "#4a4a4a"; // Gray color for the remaining portion

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <CircularProgressbarWithChildren
        value={progress}
        strokeWidth={4}
        styles={buildStyles({
          strokeLinecap: "butt",
          pathColor: pathColor,
          trailColor: trailColor,
        })}
      >
        <h1 className="mb-0">{value}F</h1>

        <p className="mb-0">{text}</p>
        <RadialSeparators
          count={15}
          style={{
            background: `${
              shipmentData?.realTimeData?.FTemperature1 >
                shipmentData?.shipmentData?.temperature?.max ||
              shipmentData?.realTimeData?.FTemperature1 <
                shipmentData?.shipmentData?.temperature?.min
                ? "#ff0808"
                : "#000"
            } `,
            // background: "#000",
            width: "12px",
            height: `${5}%`,
          }}
        />
      </CircularProgressbarWithChildren>
    </div>
  );
};

export default ProgressTempRed;
