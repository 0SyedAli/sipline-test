"use client";
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from "@react-google-maps/api";
import { useRef, useState } from "react";

const libraries = ["places"];

const containerStyle = {
  width: "100%",
  height: "500px",
  borderRadius: "0.5rem",
  marginTop: "10px",
};

const center = { lat: -33.8688, lng: 151.2195 };

export default function Map({ setLocationData }) {
  const searchBoxRef = useRef(null);
  const [position, setPosition] = useState(center);

  const handlePlacesChanged = () => {
    const places = searchBoxRef.current.getPlaces();
    if (!places || places.length === 0) return;

    const place = places[0];
    const location = place.geometry.location;
    const latitude = location.lat();
    const longitude = location.lng();

    setPosition({ lat: latitude, lng: longitude });
    setLocationData({
      locationName: place.formatted_address || place.name,
      latitude,
      longitude,
    });
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} libraries={libraries}>
      <div className="w-100 d-flex flex-column align-items-center google_search_input_set">
        <StandaloneSearchBox
          onLoad={(ref) => (searchBoxRef.current = ref)}
          onPlacesChanged={handlePlacesChanged}
        >
          <input
            type="text"
            placeholder="Search location..."
            className="form-control w-100 mt-2 shadow-sm"
          />
        </StandaloneSearchBox>

        <GoogleMap mapContainerStyle={containerStyle} center={position} zoom={14}>
          <Marker position={position} />
        </GoogleMap>
      </div>
    </LoadScript>
  );
}
