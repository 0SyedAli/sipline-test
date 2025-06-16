// components/PlacesAutocomplete.js
"use client";
import { useEffect, useRef } from 'react';

export default function PlacesAutocomplete({ onPlaceSelected }) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (!window.google) {
      console.error('Google Maps JavaScript API not loaded');
      return;
    }

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      { types: ['geocode'] }
    );

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        onPlaceSelected({
          address: place.formatted_address,
          location: place.geometry.location
        });
      }
    });

    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onPlaceSelected]);

  return (
    <input
      ref={inputRef}
      placeholder="Enter a location"
      className="w-full p-2 border rounded"
    />
  );
}