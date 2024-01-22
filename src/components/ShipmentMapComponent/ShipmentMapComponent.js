import Red0 from "../../assets/arroww/Red/Red-0.svg";
import Red30 from "../../assets/arroww/Red/Red-30.svg";
import Red60 from "../../assets/arroww/Red/Red-60.svg";
import Red90 from "../../assets/arroww/Red/Red-90.svg";
import Red120 from "../../assets/arroww/Red/Red-120.svg";
import Red150 from "../../assets/arroww/Red/Red-150.svg";
import Red180 from "../../assets/arroww/Red/Red-180.svg";
import Red210 from "../../assets/arroww/Red/Red-210.svg";
import Red240 from "../../assets/arroww/Red/Red-240.svg";
import Red270 from "../../assets/arroww/Red/Red-270.svg";
import Red300 from "../../assets/arroww/Red/Red-300.svg";
import Red330 from "../../assets/arroww/Red/Red-330.svg";

import Black0 from "../../assets/arroww/Black/Black-0.svg";
import Black30 from "../../assets/arroww/Black/Black-30.svg";
import Black60 from "../../assets/arroww/Black/Black-60.svg";
import Black90 from "../../assets/arroww/Black/Black-90.svg";
import Black120 from "../../assets/arroww/Black/Black-120.svg";
import Black150 from "../../assets/arroww/Black/Black-150.svg";
import Black180 from "../../assets/arroww/Black/Black-180.svg";
import Black210 from "../../assets/arroww/Black/Black-210.svg";
import Black240 from "../../assets/arroww/Black/Black-240.svg";
import Black270 from "../../assets/arroww/Black/Black-270.svg";
import Black300 from "../../assets/arroww/Black/Black-300.svg";
import Black330 from "../../assets/arroww/Black/Black-330.svg";
import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  withGoogleMap,
  withScriptjs,
} from "react-google-maps";
import { snazzyMapStyle } from "../../constants/snazzyMapStyle";

function GoogleMapComponent({ lat, lng, device, reloadMap }) {
  const [zoomLevel, setZoomLevel] = useState(10);

  useEffect(() => {
    if (reloadMap === true) {
      setZoomLevel(12); // Set the desired zoom level when reloadMap is true
    } else {
      setZoomLevel(11); // Set the desired zoom level when reloadMap is false
    }
  }, [reloadMap]);

  console.log("reload", reloadMap, zoomLevel);
  console.log("mera data ---> ", lat, lng, device, reloadMap);
  return (
    <GoogleMap
      zoom={zoomLevel}
      defaultZoom={4.3}
      defaultCenter={{ lat: lat, lng: lng }}
      options={{
        // mapId: process.env.REACT_APP_MAP_STYLE,
        styles: snazzyMapStyle,
        mapTypeControl: false,
        fullscreenControl: false,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.LEFT_BOTTOM,
          style: window.google.maps.ZoomControlStyle.SMALL,
        },
        streetViewControl: false,
      }}
    >
      <Marker
        position={{ lat: lat, lng: lng }} //this is for live
        icon={{
          url:
            device?.realTimeData?.FTemperature1 > device?.temperature?.max ||
            device?.realTimeData?.FTemperature1 < device?.temperature?.min ||
            device?.realTimeData?.FDoor > 0 ||
            JSON.parse(device?.realTimeData?.FExpandProto?.FDesc)?.fLx > 10
              ? device?.realTimeData?.FDirection >= 0 &&
                device?.realTimeData?.FDirection <= 30
                ? Red0
                : device?.realTimeData?.FDirection >= 30 &&
                  device?.realTimeData?.FDirection <= 60
                ? Red30
                : device?.realTimeData?.FDirection >= 60 &&
                  device?.realTimeData?.FDirection <= 90
                ? Red60
                : device?.realTimeData?.FDirection >= 90 &&
                  device?.realTimeData?.FDirection <= 120
                ? Red90
                : device?.realTimeData?.FDirection >= 120 &&
                  device?.realTimeData?.FDirection <= 150
                ? Red120
                : device?.realTimeData?.FDirection >= 150 &&
                  device?.realTimeData?.FDirection <= 180
                ? Red150
                : device?.realTimeData?.FDirection >= 180 &&
                  device?.realTimeData?.FDirection <= 210
                ? Red180
                : device?.realTimeData?.FDirection >= 210 &&
                  device?.realTimeData?.FDirection <= 240
                ? Red210
                : device?.realTimeData?.FDirection >= 240 &&
                  device?.realTimeData?.FDirection <= 270
                ? Red240
                : device?.realTimeData?.FDirection >= 270 &&
                  device?.realTimeData?.FDirection <= 300
                ? Red270
                : device?.realTimeData?.FDirection >= 300 &&
                  device?.realTimeData?.FDirection <= 330
                ? Red300
                : device?.realTimeData?.FDirection >= 330 &&
                  device?.realTimeData?.FDirection <= 360
                ? Red330
                : Red0
              : device?.realTimeData?.FDirection === 0
              ? Black0
              : device?.realTimeData?.FDirection >= 0 &&
                device?.realTimeData?.FDirection <= 30
              ? Black0
              : device?.realTimeData?.FDirection >= 30 &&
                device?.realTimeData?.FDirection <= 60
              ? Black30
              : device?.realTimeData?.FDirection >= 60 &&
                device?.realTimeData?.FDirection <= 90
              ? Black60
              : device?.realTimeData?.FDirection >= 90 &&
                device?.realTimeData?.FDirection <= 120
              ? Black90
              : device?.realTimeData?.FDirection >= 120 &&
                device?.realTimeData?.FDirection <= 150
              ? Black120
              : device?.realTimeData?.FDirection >= 150 &&
                device?.realTimeData?.FDirection <= 180
              ? Black150
              : device?.realTimeData?.FDirection >= 180 &&
                device?.realTimeData?.FDirection <= 210
              ? Black180
              : device?.realTimeData?.FDirection >= 210 &&
                device?.realTimeData?.FDirection <= 240
              ? Black210
              : device?.realTimeData?.FDirection >= 240 &&
                device?.realTimeData?.FDirection <= 270
              ? Black240
              : device?.realTimeData?.FDirection >= 270 &&
                device?.realTimeData?.FDirection <= 300
              ? Black270
              : device?.realTimeData?.FDirection >= 300 &&
                device?.realTimeData?.FDirection <= 330
              ? Black300
              : device?.realTimeData?.FDirection >= 330 &&
                device?.realTimeData?.FDirection <= 360
              ? Black330
              : Black0,
          scaledSize: new window.google.maps.Size(34, 34),
          anchor: new window.google.maps.Point(12, 12),
        }}
      />
    </GoogleMap>
  );
}

const WrappedMapComponent = withScriptjs(withGoogleMap(GoogleMapComponent));

function ShipmentMapComponent({ lat, lng, device, reloadMap }) {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <WrappedMapComponent
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_MAP_API}&v=3.exp&libraries=geometry,drawing,places`}
        loadingElement={<div style={{ height: "100%" }} />}
        containerElement={<div style={{ height: "100%" }} />}
        mapElement={<div style={{ height: "100%" }} />}
        lat={lat}
        lng={lng}
        device={device}
        reloadMap={reloadMap}
      />
    </div>
  );
}

export default ShipmentMapComponent;
