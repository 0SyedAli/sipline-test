// app/add-location/page.jsx
"use client";
import { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import PlacesAutocomplete from '@/components/PlacesAutocomplete';
import { useRouter } from 'next/navigation';

export default function AddLocation() {
  const [showSearch, setShowSearch] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Load Google Maps API script
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  const handlePlaceSelected = (place) => {
    setSelectedPlace({
      address: place.address,
      lat: place.location.lat(),
      lng: place.location.lng()
    });
  };

  return (
    <div className="p-4">
      {!showSearch ? (
        <button
          onClick={() => setShowSearch(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          <FaPlus /> Add Location
        </button>
      ) : (
        <div className="space-y-4">
          <PlacesAutocomplete onPlaceSelected={handlePlaceSelected} />
          
          {selectedPlace && (
            <div className="mt-4">
              <h3 className="font-bold">Selected Location:</h3>
              <p>{selectedPlace.address}</p>
              <p>Lat: {selectedPlace.lat.toFixed(6)}, Lng: {selectedPlace.lng.toFixed(6)}</p>
              
              <div className="mt-4 h-64 w-full bg-gray-200">
                {/* Simple map embed showing the location */}
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${selectedPlace.lat},${selectedPlace.lng}`}
                />
              </div>
            </div>
          )}

          <button
            onClick={() => router.push('/auth/locationdetails')}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Confirm Location
          </button>
        </div>
      )}
    </div>
  );
}