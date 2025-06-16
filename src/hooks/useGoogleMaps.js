// hooks/useGoogleMaps.js
"use client";
import { useEffect, useState } from 'react';

export default function useGoogleMaps() {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if already loaded
    if (window.google && window.google.maps) {
      setLoaded(true);
      return;
    }

    // Check if script is already being loaded
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      const interval = setInterval(() => {
        if (window.google && window.google.maps) {
          setLoaded(true);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }

    // Load the script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google && window.google.maps) {
        setLoaded(true);
      } else {
        setError(new Error('Google Maps API not available after loading'));
      }
    };
    script.onerror = () => setError(new Error('Failed to load Google Maps API'));

    document.head.appendChild(script);

    return () => {
      // Don't remove the script as it's needed globally
    };
  }, []);

  return { loaded, error };
}