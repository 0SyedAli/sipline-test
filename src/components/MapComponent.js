// const MapComponent = ({ coordinates }) => {
//   const { lat, lng } = coordinates || { lat: 39.0997, lng: -94.5786 };

//   return (
//     <div style={{ position: "relative", height: "270px", width: "100%" }}>
//       <iframe
//         src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10000!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDA1JzU4LjkiTiA5NMKwMzQnNDMuMCJX!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s`}
//         width="100%"
//         height="100%"
//         style={{ border: 0 }}
//         allowFullScreen=""
//         loading="lazy"
//         referrerPolicy="no-referrer-when-downgrade"
//       ></iframe>
//     </div>
//   );
// };

// export default MapComponent;


"use client";
import { useEffect, useRef } from "react";

const MapComponent = ({ apiKey, onLocationSelect }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const initializeMap = () => {
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 39.03045329060634, lng: -94.4387242276673 },
        zoom: 12,
      });

      const marker = new google.maps.Marker({
        position: { lat: 39.03045329060634, lng: -94.4387242276673 },
        map,
        draggable: true,
      });

      const geocoder = new google.maps.Geocoder();

      marker.addListener("dragend", async () => {
        const { lat, lng } = marker.getPosition().toJSON();
        const response = await geocoder.geocode({ location: { lat, lng } });
        const address = response?.results[0]?.formatted_address || "Unknown Address";
        onLocationSelect(address);
      });
    };

    if (!window.google && apiKey) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.onload = initializeMap;
      document.body.appendChild(script);
    } else if (window.google) {
      initializeMap();
    }
  }, [apiKey]);

  return <div ref={mapRef} style={{ height: "270px", width: "100%" }} />;
};

export default MapComponent;
