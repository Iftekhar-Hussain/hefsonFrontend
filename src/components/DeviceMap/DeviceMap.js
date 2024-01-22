import React, { useRef, useEffect } from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import customMarkerBlack from "../../assets/Group_1000008683.svg";
// import customMarkerBlack from "../../assets/hefson.png";
import customMarker from "../../assets/Group_1000008684.svg"; // import your custom marker icon Group 1000008280.svg

function DeviceMap(props) {
  const mapRef = useRef(null);
  const markerPositions = [
    { lat: 38.5, lng: -98.0 },
    { lat: 37.7749, lng: -110.4194 },
    { lat: 40.7128, lng: -74.006 },
    { lat: 40.7128, lng: -84.006 },
  ];

  useEffect(() => {
    if (mapRef.current) {
      const { google } = props;
      const map = mapRef.current.map;

      map.setOptions({
        mapId: process.env.REACT_APP_MAP_STYLE,
        zoom: 3.5,
        center: { lat: 38.5, lng: -98.0 },
        mapTypeControl: false,
        fullscreenControl: false,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_BOTTOM,
          style: google.maps.ZoomControlStyle.SMALL,
        },
      });
    }
  }, [props]);

  return (
    <Map
      google={props.google}
      ref={mapRef}
      initialCenter={{ lat: 37.7749, lng: -122.4194 }}
      className="position-static"
    >
      {markerPositions.map((position, index) => (
        <Marker
          key={index}
          position={position}
          icon={{
            url: customMarker,
            anchor: new props.google.maps.Point(32, 32),
            scaledSize: new props.google.maps.Size(34, 34),
          }}
          onClick={() => console.log("Marker")}
        />
      ))}
    </Map>
  );
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_MAP_API,
})(DeviceMap);
