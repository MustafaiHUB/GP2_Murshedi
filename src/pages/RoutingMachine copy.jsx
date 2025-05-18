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
