import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
// import RoutingMachine from "./RoutingMachine";

function Map({ targetCoords }) {
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
          <Marker
            position={targetCoords}
            key={Math.random()}
          >
            <Popup>CPE101</Popup>
          </Marker>
          {/* <RoutingMachine
            myPosition={location}
            targetPosition={targetCoords}
          /> */}
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
