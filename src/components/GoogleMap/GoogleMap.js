import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, DirectionsRenderer } from "google-maps-react";

import blackMarkerIcon from "../../assets/Group_1000008683.svg";

function GoogleMapComponent({ google }) {
  const [directions, setDirections] = useState(null);

  const origin = { lat: 38.5, lng: -98.0 };
  const destination = { lat: 37.7749, lng: -110.4194 };

  useEffect(() => {
    if (google) {
      calculateDirections();
    }
  }, [google]);

  const calculateDirections = () => {
    const directionsService = new google.maps.DirectionsService();

    const request = {
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        setDirections(result);
      }
    });
  };

  return (
    <GoogleMap
      zoom={4.3}
      center={{ lat: 38.5, lng: -98.0 }}
      options={{
        mapId: process.env.REACT_APP_MAP_STYLE,
        mapTypeControl: false,
        fullscreenControl: false,
        zoomControlOptions: {
          position: google.maps.ControlPosition.LEFT_BOTTOM,
          style: google.maps.ZoomControlStyle.SMALL,
        },
      }}
    >
      {directions && (
        <DirectionsRenderer
          directions={directions}
          options={{
            suppressMarkers: true, // Hide the default location markers
            polylineOptions: {
              strokeColor: "black", // Set the color of the path to black
            },
          }}
        />
      )}
      <Marker
        position={origin}
        icon={blackMarkerIcon}
        anchor={{ x: 0, y: 0 }} // Set the anchor point to (0, 0) in pixel coordinates
      />
      <Marker
        position={destination}
        icon={blackMarkerIcon}
        anchor={{ x: 0, y: 0 }} // Set the anchor point to (0, 0) in pixel coordinates
      />
    </GoogleMap>
  );
}

function GoogleMaps() {
  const [googleLoaded, setGoogleLoaded] = useState(false);

  const handleApiLoaded = (map, maps) => {
    setGoogleLoaded(true);
  };

  return (
    <div style={{ height: "50vh", width: "100%" }}>
      {googleLoaded && (
        <GoogleMapComponent
          google={window.google}
          apiKey={process.env.REACT_APP_MAP_API}
        />
      )}
      <GoogleMap
        google={window.google}
        onLoad={handleApiLoaded}
        mapContainerStyle={{ height: "100%", width: "100%" }}
      />
    </div>
  );
}

export default GoogleMaps;
