import React from "react";
import LeafletMap from "../leaflet-map/leaflet-map";

const App = () => {
  return <LeafletMap latlng={[51.505, -0.09]} zoom="12" />;
};

export default App;
