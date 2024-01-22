import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  withGoogleMap,
  withScriptjs,
} from "react-google-maps";
import locationIcon from "../../assets/blackLocation.png";

function GoogleMapComponent({
  latitudeShipper,
  longitudeShipper,
  latitudeReceiver,
  longitudeReceiver,
  currentId,
  markerLat,
  markerLng,
}) {
  const [directions, setDirections] = useState(null);
  const [directionsn, setDirectionsn] = useState(null);

  useEffect(() => {
    calculateDirections();
    calculateDirectionsn(); // Call the function to calculate directionsn
  }, [latitudeShipper, longitudeShipper, latitudeReceiver, longitudeReceiver]);

  const origin = { lat: latitudeShipper, lng: longitudeShipper };
  const imarker = { lat: markerLat, lng: markerLng };
  const destination = { lat: latitudeReceiver, lng: longitudeReceiver };

  const calculateDirections = () => {
    const { google } = window;
    const directionsService = new google.maps.DirectionsService();

    const request = {
      origin,
      destination: imarker, // Use imarker as the destination
      travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        setDirections(result);
      }
    });
  };

  const calculateDirectionsn = () => {
    const { google } = window;
    const directionsService = new google.maps.DirectionsService();

    const request = {
      origin: imarker, // Use imarker as the origin
      destination,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        setDirectionsn(result);
      }
    });
  };

  return (
    <GoogleMap
      defaultZoom={4.3}
      defaultCenter={{ lat: 38.5, lng: -98.0 }}
      options={{
        mapId: process.env.REACT_APP_MAP_STYLE,
        mapTypeControl: false,
        fullscreenControl: false,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.LEFT_BOTTOM,
          style: window.google.maps.ZoomControlStyle.SMALL,
        },
        streetViewControl: false,
      }}
    >
      {directionsn && (
        <DirectionsRenderer
          directions={directionsn}
          options={{
            polylineOptions: {
              strokeColor: "black",
              strokeOpacity: 1,
              icons: [
                {
                  icon: {
                    path: "M 0,-1 0,1",
                    strokeOpacity: 0,
                    scale: 4,
                  },
                  offset: "0",
                  repeat: "20px",
                },
              ],
            },
            // suppressMarkers: true, // Disable the default destination marker
            // suppressInfoWindows: true, // Disable info windows for markers
            markerOptions: {
              icon: {
                url: locationIcon,
                scaledSize: new window.google.maps.Size(32, 22),
              },
            },
          }}
          
        />
      )}

      {directions && (
        <DirectionsRenderer
          directions={directions}
          options={{
            polylineOptions: {
              strokeColor: "black",
              strokeOpacity: 0,
              icons: [
                {
                  icon: {
                    path: "M 0,-1 0,2",
                    strokeOpacity: 0.7,
                    scale: 2,
                  },
                  offset: "0",
                  repeat: "12px",
                },
              ],
            },
            
            markerOptions: {
              icon: {
                url: locationIcon,
                scaledSize: new window.google.maps.Size(32, 22),
              },
            },
          }}
          
        />
      )}

      <Marker
        // position={{ lat: 39.69983, lng: -105.215705 }}
        position={{ lat: markerLat, lng: markerLng }} //this is for live
        icon={{
          url: `data:image/svg+xml;utf-8,
            <svg xmlns="http://www.w3.org/2000/svg" width="84" height="84" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="black" />
              <text x="50%" y="50%" text-anchor="middle" fill="white" font-size="7px" font-weight="bold" dy=".3em">${24}°F</text>
            </svg>`,
          scaledSize: new window.google.maps.Size(34, 34),
          anchor: new window.google.maps.Point(12, 12),
        }}
      />
    </GoogleMap>
  );
}

const WrappedMapComponent = withScriptjs(withGoogleMap(GoogleMapComponent));

function TripMapDetail({
  latitudeShipper,
  longitudeShipper,
  latitudeReceiver,
  longitudeReceiver,
  currentId,
  markerLat,
  markerLng,
}) {
  return (
    <div style={{ height: "50vh", width: "100%" }}>
      <WrappedMapComponent
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_MAP_API}&v=3.exp&libraries=geometry,drawing,places`}
        loadingElement={<div style={{ height: "100%" }} />}
        containerElement={<div style={{ height: "100%" }} />}
        mapElement={<div style={{ height: "100%" }} />}
        latitudeShipper={latitudeShipper}
        longitudeShipper={longitudeShipper}
        latitudeReceiver={latitudeReceiver}
        longitudeReceiver={longitudeReceiver}
        currentId={currentId}
        markerLat={markerLat}
        markerLng={markerLng}
      />
    </div>
  );
}

export default TripMapDetail;
