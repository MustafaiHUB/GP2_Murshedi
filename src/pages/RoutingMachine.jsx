import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";

const createRoutineMachineLayer = ({ myPosition, targetPosition }) => {
  const instance = L.Routing.control({
    waypoints: [
      L.latLng(myPosition[0], myPosition[1]),
      L.latLng(targetPosition[0], targetPosition[1]),
    ],
    lineOptions: {
      styles: [{ color: "#6FA1EC", weight: 4 }],
    },
    // Set custom routing service URL
    router: L.Routing.osrmv1({
      serviceUrl: "https://router.project-osrm.org/route/v1",
      // Alternative: use a commercial service like MapBox Directions API
      // serviceUrl: 'https://api.mapbox.com/directions/v5/mapbox/driving',
      // profile: 'driving',
      // timeout: 30 * 1000, // 30s timeout
    }),
    containerClassName: "hidden-routing-container",
    show: false,
    addWaypoints: false,
    routeWhileDragging: true,
    draggableWaypoints: true,
    fitSelectedRoutes: false,
    showAlternatives: false,
    plan: false,
  });

  return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;
