import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import { Box } from "@mui/material";

export default function GyroscopeControl() {
  const map = useMap();
  const [isGyroscopeEnabled, setGyroscopeEnabled] = useState(false);
  const [deviceOrientationEvent, setDeviceOrientationEvent] = useState(false);
  const [alpha, setAlpha] = useState(0);

  useEffect(() => {
    // Check if DeviceOrientationEvent is supported
    if ("DeviceOrientationEvent" in window) {
      setDeviceOrientationEvent(true);
    } else {
      setDeviceOrientationEvent(false);
    }
  }, []);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const alpha = event.alpha; // Rotation around the z-axis (in degrees)
      if (alpha !== null) {
        // Apply rotation to the map
        map.getContainer().style.transform = `rotate(${alpha}deg)`;
        setAlpha(alpha);
      }
    };

    if (deviceOrientationEvent && isGyroscopeEnabled) {
      window.addEventListener("deviceorientation", handleOrientation);
    } else {
      console.warn("DeviceOrientationEvent is not supported on this device.");
    }
  }, [deviceOrientationEvent, isGyroscopeEnabled, map]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", py: 1 }}>
      <label>Gyroscope: {String(alpha)}</label>
      <button
        className="btn"
        disabled={deviceOrientationEvent}
        onClick={() => setGyroscopeEnabled((prev) => !prev)}
      >
        {isGyroscopeEnabled ? "ON" : "OFF"}
      </button>
    </Box>
  );
}
