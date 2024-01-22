import React, { useRef, useEffect, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerClusterer,
  Marker,
} from "@react-google-maps/api";
import { InfoWindow } from "google-maps-react";
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

function TrailerMap({ device, reloadMap, setSensor }) {
  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  const center = {
    lat: device[0]?.realTimeData?.FLatitude || 37.7749,
    lng: device[0]?.realTimeData?.FLongitude || -79.745298,
  };

  const zoom = 4.3;

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_MAP_API,
  });

  const mapRef = useRef(null);
  const [infoWindowPosition, setInfoWindowPosition] = useState(null);

  const handleMarker = (index, data) => {
    setInfoWindowPosition({
      lat: data?.realTimeData?.FLatitude,
      lng: data?.realTimeData?.FLongitude,
    });
    // ... (existing code)
  };

  const handleClusterClick = (cluster) => {
    const markers = cluster.getMarkers();
    const bounds = new window.google.maps.LatLngBounds();

    markers.forEach((marker) => bounds.extend(marker.getPosition()));

    mapRef.current.fitBounds(bounds);
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ height: "500px", position: "relative" }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        onLoad={(map) => (mapRef.current = map)}
        style={snazzyMapStyle}
      >
        <MarkerClusterer
          options={{
            imagePath:
              "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
          }}
          onClick={handleClusterClick}
        >
          {(clusterer) =>
            device.map((device, index) => (
              <Marker
                key={index}
                position={{
                  lat: device?.realTimeData?.FLatitude,
                  lng: device?.realTimeData?.FLongitude,
                }}
                onClick={() => handleMarker(index, device)}
                clusterer={clusterer}
                icon={{
                  url: Red0
                }}
              />
            ))
          }
        </MarkerClusterer>

        {infoWindowPosition && (
          <InfoWindow
            position={infoWindowPosition}
            onClose={() => setInfoWindowPosition(null)}
          >
            {/* Add content for InfoWindow if needed */}
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

export default TrailerMap;
