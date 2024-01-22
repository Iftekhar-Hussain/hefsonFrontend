import React, { useRef, useEffect, useState } from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import { useDispatch } from "react-redux";

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

import Blue0 from "../../assets/arroww/Blue/Blue-0.svg";
import Blue30 from "../../assets/arroww/Blue/Blue-30.svg";
import Blue60 from "../../assets/arroww/Blue/Blue-60.svg";
import Blue90 from "../../assets/arroww/Blue/Blue-90.svg";
import Blue120 from "../../assets/arroww/Blue/Blue-120.svg";
import Blue150 from "../../assets/arroww/Blue/Blue-150.svg";
import Blue180 from "../../assets/arroww/Blue/Blue-180.svg";
import Blue210 from "../../assets/arroww/Blue/Blue-210.svg";
import Blue240 from "../../assets/arroww/Blue/Blue-240.svg";
import Blue270 from "../../assets/arroww/Blue/Blue-270.svg";
import Blue300 from "../../assets/arroww/Blue/Blue-300.svg";
import Blue330 from "../../assets/arroww/Blue/Blue-330.svg";

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
import { snazzyMapStyle } from "../../constants/snazzyMapStyle";

// import Red from "../../assets/Red-0.svg";

function TrailerMap(props) {
  const mapRef = useRef(null);
  const dispatch = useDispatch();
  const [deviceData, setDeviceData] = useState(null);
  const [clickedMarkerIndex, setClickedMarkerIndex] = useState(null);

  const handleMarker = (index, data) => {
    props.setSensor(data);
    setClickedMarkerIndex(index);
  };

  useEffect(() => {
    setDeviceData(props.device);
    props.setSensor(props.device[0]);
    setClickedMarkerIndex(0);
    console.log("props.device 1 === ", props.device);
    console.log(deviceData, "decccccc 1");
    if (mapRef.current) {
      const { google } = props;
      const map = mapRef.current.map;

      map?.setOptions({
        // mapId: process.env.REACT_APP_MAP_STYLE,
        styles: snazzyMapStyle,
        zoom: 4.3,
        center: {
          lat: 44.5,
          lng: -100.0,
        },
        mapTypeControl: false,
        fullscreenControl: false,
        zoomControlOptions: {
          position: google.maps.ControlPosition.LEFT_BOTTOM,
          style: google.maps.ZoomControlStyle.SMALL,
        },
        streetViewControl: false,
        streetViewControlOptions: {
          position: google.maps.ControlPosition.LEFT_BOTTOM,
        },
      });
    }
  }, [props.device]); //this hit when page load for the first time

  useEffect(() => {
    setDeviceData(props.device);
    props.setSensor(props.device[0]);
    setClickedMarkerIndex(0);
    console.log("props.device === ", props.device);
    console.log(deviceData, "decccccc");
    if (mapRef.current) {
      const { google } = props;
      const map = mapRef.current.map;

      map?.setOptions({
        // mapId: process.env.REACT_APP_MAP_STYLE,
        styles: snazzyMapStyle,
        zoom: 4.3,
        center: {
          lat: 44.5,
          lng: -100.0,
        },
        mapTypeControl: false,
        fullscreenControl: false,
        zoomControlOptions: {
          position: google.maps.ControlPosition.LEFT_BOTTOM,
          style: google.maps.ZoomControlStyle.SMALL,
        },
        streetViewControl: false,
        streetViewControlOptions: {
          position: google.maps.ControlPosition.LEFT_BOTTOM,
        },
      });
    }
  }, [props.reloadMap]); // Add props.reloadMap to useEffect dependency array

  useEffect(() => {
    // Reload the map when props.reloadMap changes
    if (props.reloadMap && mapRef.current) {
      const { google } = props;
      const map = mapRef.current.map;
      map.setZoom(4.3); // Set the desired zoom level
    }
  }, [props.reloadMap]);

  console.log(deviceData, "BBcccccc");

  return (
    <div>
      <Map
        google={props.google}
        ref={mapRef}
        initialCenter={{
          lat:
            (deviceData && deviceData[0]?.realTimeData?.FLatitude) || 37.7749,
          lng:
            (deviceData && deviceData[0]?.realTimeData?.FLongitude) ||
            -79.745298,
        }}
        className="position-static"
      >
        {deviceData &&
          deviceData.map((device, index) => (
            <Marker
              key={index}
              position={{
                lat: device?.realTimeData?.FLatitude,
                lng: device?.realTimeData?.FLongitude,
              }}
              icon={{
                url:
                  device?.realTimeData?.FTemperature1 >
                    device?.shipmentData?.temperature?.max ||
                  device?.realTimeData?.FTemperature1 <
                    device?.shipmentData?.temperature?.min ||
                  device?.realTimeData?.FDoor > 0 ||
                  JSON.parse(device?.realTimeData?.FExpandProto?.FDesc)?.fLx >
                    10
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
                    : clickedMarkerIndex === index
                    ? device?.realTimeData?.FDirection >= 0 &&
                      device?.realTimeData?.FDirection <= 30
                      ? Blue0
                      : device?.realTimeData?.FDirection >= 30 &&
                        device?.realTimeData?.FDirection <= 60
                      ? Blue30
                      : device?.realTimeData?.FDirection >= 60 &&
                        device?.realTimeData?.FDirection <= 90
                      ? Blue60
                      : device?.realTimeData?.FDirection >= 90 &&
                        device?.realTimeData?.FDirection <= 120
                      ? Blue90
                      : device?.realTimeData?.FDirection >= 120 &&
                        device?.realTimeData?.FDirection <= 150
                      ? Blue120
                      : device?.realTimeData?.FDirection >= 150 &&
                        device?.realTimeData?.FDirection <= 180
                      ? Blue150
                      : device?.realTimeData?.FDirection >= 180 &&
                        device?.realTimeData?.FDirection <= 210
                      ? Blue180
                      : device?.realTimeData?.FDirection >= 210 &&
                        device?.realTimeData?.FDirection <= 240
                      ? Blue210
                      : device?.realTimeData?.FDirection >= 240 &&
                        device?.realTimeData?.FDirection <= 270
                      ? Blue240
                      : device?.realTimeData?.FDirection >= 270 &&
                        device?.realTimeData?.FDirection <= 300
                      ? Blue270
                      : device?.realTimeData?.FDirection >= 300 &&
                        device?.realTimeData?.FDirection <= 330
                      ? Blue300
                      : device?.realTimeData?.FDirection >= 330 &&
                        device?.realTimeData?.FDirection <= 360
                      ? Blue330
                      : Blue0
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
                // anchor: new window.google.maps.Point(10, 20),
                // scaledSize: new window.google.maps.Size(20, 20),
                anchor: new window.google.maps.Point(15, 25),
                scaledSize: new window.google.maps.Size(25, 25),
              }}
              onClick={() => handleMarker(index, device)}
              className="marker-icon"
              iconStyle={{
                border: "2px solid red",
                transform: "rotate(45deg)",
              }}
            />
          ))}
      </Map>
    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_MAP_API,
})(TrailerMap);
