import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useState, useEffect } from "react";
import RoutingMachine from "./RoutingMachine";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Define boundary constants
const BOUNDARY_CENTER = [32.010585, 35.875693];
const BOUNDARY_RADIUS_METERS = 300;

// Helper function to calculate distance between two points in meters
const calculateDistance = (point1, point2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (point1[0] * Math.PI) / 180;
  const φ2 = (point2[0] * Math.PI) / 180;
  const Δφ = ((point2[0] - point1[0]) * Math.PI) / 180;
  const Δλ = ((point2[1] - point1[1]) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

function Map({ targetCoords }) {
  const [userLocation, setUserLocation] = useState(null);
  const [isWithinBoundary, setIsWithinBoundary] = useState(false);
  const [locationPermission, setLocationPermission] = useState("pending");

  useEffect(() => {
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = [position.coords.latitude, position.coords.longitude];
          setUserLocation(userPos);
          setLocationPermission("granted");

          // Check if user is within boundary
          const distance = calculateDistance(userPos, BOUNDARY_CENTER);
          setIsWithinBoundary(distance <= BOUNDARY_RADIUS_METERS);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationPermission("denied");
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setLocationPermission("unsupported");
    }
  }, []);

  // Show routing only if user is outside boundary AND permission is granted
  const showRouting =
    userLocation && locationPermission === "granted" && !isWithinBoundary;

  return (
    <>
      <div style={{ height: "300px", marginTop: "20px" }}>
        <MapContainer
          center={targetCoords}
          zoom={15}
          scrollWheelZoom={true}
          style={{ height: "300px", zIndex: 9 }}
        >
          <TileLayer
            attribution=''
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />

          {/* Target location marker - always shown */}
          <Marker
            position={targetCoords}
            key='target'
            icon={L.icon({
              iconUrl:
                "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
              shadowUrl:
                "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41],
            })}
          >
            <Popup>Target Location</Popup>
          </Marker>

          {/* User location marker - always shown if we have the location */}
          {userLocation && (
            <Marker
              position={userLocation}
              key='user'
              icon={L.icon({
                iconUrl:
                  "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
                shadowUrl:
                  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
              })}
            >
              <Popup>Your Location</Popup>
            </Marker>
          )}

          {/* Routing machine - only shown if user is outside boundary AND permission granted */}
          {showRouting && (
            <RoutingMachine
              myPosition={userLocation}
              targetPosition={targetCoords}
            />
          )}

          {/* Update map center based on target coordinates */}
          <ChangeCenter position={targetCoords} />
        </MapContainer>
      </div>
    </>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

export default Map;
