// app/test-map/page.jsx
"use client";
import useGoogleMaps from '@/hooks/useGoogleMaps';
import { useEffect, useRef } from 'react';

export default function TestMap() {
  const { loaded, error } = useGoogleMaps();
  const mapRef = useRef(null);

  useEffect(() => {
    if (!loaded || error) return;

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
      });

      new window.google.maps.Marker({
        position: { lat: -34.397, lng: 150.644 },
        map,
        title: 'Hello World!',
      });
    } catch (err) {
      console.error('Map initialization error:', err);
    }
  }, [loaded, error]);

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading Google Maps: {error.message}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Google Maps Test</h1>
      {!loaded && <div>Loading Google Maps...</div>}
      <div 
        ref={mapRef} 
        style={{ height: '400px', width: '100%' }} 
        className="border border-gray-300"
      />
    </div>
  );
}