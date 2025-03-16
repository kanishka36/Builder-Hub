import React, { useState, useMemo, useRef, useCallback } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import axios from "axios";
import ActionButton from "./Button/ActionButton";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const mapContainerStyle = {
  width: "100%",
  height: "300px",
};

// Default latitude longitude (Colombo, Sri Lanka)
const center = {
  lat: 6.9271,
  lng: 79.8612,
};

const SetLocation = ({ userId }) => {
  // Accept userId as a prop
  const [marker, setMarker] = useState(center);
  const [searchInput, setSearchInput] = useState("");
  const autocompleteRef = useRef(null);
  const apiUrl = import.meta.env.VITE_ROUTE_URL;
  const { currentUser } = useSelector((state) => state.user);
  const sellerId = currentUser?._id;

  const googleMapsApiKey = useMemo(
    () => import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    []
  );
  const libraries = useMemo(() => ["places"], []);

  // Load Google Maps API securely
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey,
    libraries,
  });

  // Function to save location to backend when clicking "Save Location"
  const saveLocationToDB = async () => {
    try {
      const res = await axios.put(
        `${apiUrl}/api/location/${sellerId}`,
        { lat: marker.lat, lng: marker.lng }, 
        { withCredentials: true }
      );
      console.log("Location updated:", res.data.data);
      toast.success("Location updated successfully!", {
        position: "top-center",
        autoClose: 1500,
      });
    } catch (error) {
      console.error("Error updating location:", error);
      toast.error("Failed to update location.", {
        position: "top-center",
        autoClose: 1500,
      });
    }
  };

  // Handle marker placement when user clicks on the map
  const onMapClick = useCallback((event) => {
    setMarker({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  }, []);

  // Handle place selection from autocomplete
  const onPlaceSelected = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const newLocation = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setMarker(newLocation);
        setSearchInput(place.formatted_address || "");
      }
    }
  };

  // Handle manual location search using Geocoding API
  const fetchGeocode = async () => {
    if (!searchInput) return;
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          searchInput
        )}&key=${googleMapsApiKey}`
      );
      const data = await response.json();
      if (data.status === "OK") {
        const newLocation = data.results[0].geometry.location;
        setMarker(newLocation);
      } else {
        alert("Location not found. Please enter a valid address.");
      }
    } catch (error) {
      console.error("Geocoding API error:", error);
      alert("Failed to fetch location.");
    }
  };

  if (loadError) return <p>Error loading maps</p>;
  if (!isLoaded) return <p>Loading maps...</p>;

  return (
    <div>
      <div style={{ marginBottom: "10px", display: "flex", gap: "10px" }}>
        <Autocomplete
          onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
          onPlaceChanged={onPlaceSelected}
        >
          <input
            type="text"
            className="border rounded-lg"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for a location"
            style={{ flex: 1, padding: "10px", fontSize: "16px" }}
          />
        </Autocomplete>
        <ActionButton
          onClick={fetchGeocode}
          name={'Search'}
        />
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={marker}
        zoom={12}
        onClick={onMapClick}
      >
        <Marker
          position={marker}
          draggable={true}
          onDragEnd={(e) => {
            setMarker({ lat: e.latLng.lat(), lng: e.latLng.lng() });
          }}
        />
      </GoogleMap>

      {/* Save Location Button */}
      <div style={{ marginTop: "10px" }}>
        <ActionButton onClick={saveLocationToDB} name={"Save Location"} />
      </div>
    </div>
  );
};

export default SetLocation;
