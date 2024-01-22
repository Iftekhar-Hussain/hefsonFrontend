import React from "react";

const BatteryComponent = ({ level }) => {
  const getBatteryIcon = () => {
    if (level >= 75) {
      return "battery-full";
    } else if (level >= 50) {
      return "battery-three-quarters";
    } else if (level >= 25) {
      return "battery-half";
    } else if (level >= 10) {
      return "battery-quarter";
    } else {
      return "battery-empty";
    }
  };

  const batteryIcon = getBatteryIcon();

  return <i className={`fas fa-${batteryIcon}`}></i>;
};

export default BatteryComponent;
