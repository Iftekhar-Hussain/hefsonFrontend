import React, { useState, useEffect } from "react";

const GeocodingComponent = ({ lat, lng }) => {
  const [address, setAddress] = useState("");

  useEffect(() => {
    // Load the Google Maps API script dynamically
    const loadGoogleMapsScript = () => {
      const googleMapsScript = document.createElement("script");
      googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_MAP_API}&libraries=places`;
      googleMapsScript.async = true;
      googleMapsScript.defer = true;
      googleMapsScript.onload = initializeGeocoder;
      document.head.appendChild(googleMapsScript);
    };

    // Initialize the Geocoder after the Google Maps API script has loaded
    const initializeGeocoder = () => {
      const geocoder = new window.google.maps.Geocoder();
      const latLng = new window.google.maps.LatLng(lat, lng);

      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === window.google.maps.GeocoderStatus?.OK) {
          const formattedAddress = results[0]?.formatted_address;
          if (formattedAddress) {
            setAddress(formattedAddress);
          } else {
            setAddress("No address found");
          }
        } else {
          console.error("Geocoder failed due to:", status);
          setAddress("Geocoder failed");
        }
      });
    };

    // Load the Google Maps API script when the component mounts
    loadGoogleMapsScript();
  }, [lat, lng]);

  return <div>{address}</div>;
};

export default GeocodingComponent;
