import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";
import axios from "axios";
import ActionButton from "../components/Button/ActionButton";

const mapContainerStyle = { width: "100%", height: "400px" };
const defaultCenter = { lat: 6.9271, lng: 79.8612 }; // Default: Colombo, Sri Lanka

const NearbySellersMap = ({ userLocation }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [sellers, setSellers] = useState([]);
  const [mapCenter, setMapCenter] = useState(userLocation || defaultCenter);
  const [searchInput, setSearchInput] = useState("");
  const [selectedSeller, setSelectedSeller] = useState(null); // State to track hovered seller
  const apiUrl = import.meta.env.VITE_ROUTE_URL;

  useEffect(() => {
    if (userLocation) {
      fetchNearbySellers(userLocation.lat, userLocation.lng);
    }
  }, [userLocation]);

  const fetchNearbySellers = async (lat, lng) => {
    try {
      const res= await axios.get(`${apiUrl}/api/nearby-sellers`, {
        params: { latitude: lat, longitude: lng, radius: 10 }, // 10 km radius
      });
      console.log(res,"response")
      setSellers(res.data);
      setMapCenter({ lat, lng });
    } catch (error) {
      console.error("Error fetching sellers:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchInput) return;

    try {
      const geocodeResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: searchInput,
            key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
          },
        }
      );

      if (geocodeResponse.data.results.length > 0) {
        const location = geocodeResponse.data.results[0].geometry.location;
        setMapCenter({ lat: location.lat, lng: location.lng });
        fetchNearbySellers(location.lat, location.lng);
      } else {
        alert("Location not found. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching geolocation:", error);
      alert("Failed to retrieve location. Try again.");
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      {/* Search Input */}
      <div className="flex gap-3 w-1/2 mb-3">    
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Enter location..."
            className="field-style"
          />
          <ActionButton
            onClick={handleSearch}
            name={"Search"}
          />
      </div>

      {/* Map Display */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={mapCenter}
      >
        {sellers.map((seller) => (
          <Marker
            key={seller._id}
            position={{
              lat: seller.location.coordinates[1],
              lng: seller.location.coordinates[0],
            }}
            
            onClick={() => setSelectedSeller(seller)}
          />
        ))}

        {selectedSeller && (
          <InfoWindow
            position={{
              lat: selectedSeller.location.coordinates[1],
              lng: selectedSeller.location.coordinates[0],
            }}
            onCloseClick={() => setSelectedSeller(null)}
          >
            <div>
              <h3>{selectedSeller.name}</h3>
              <p>
                <strong>Name:</strong> {selectedSeller.username}
              </p>
              <p>
                <strong>Role:</strong> {selectedSeller.role.name}
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default NearbySellersMap;
