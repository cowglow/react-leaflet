import { Box } from "@mui/material";
import { useEffect, useState } from "react";

export default function NavigatorControl() {
  const [isNavigatorEnabled, setIsNavigatorEnabled] = useState(false);
  const [data, setData] = useState<Geolocation | null>(null);
  const hasNavigator = "geolocation" in navigator;

  useEffect(() => {
    if (hasNavigator && isNavigatorEnabled) {
      navigator.geolocation.watchPosition(
        (data) => {
          setData((prevState) => ({ ...prevState, ...data }));
        },
        (error) => {
          console.error("Error watching position:", error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 1000,
        },
      );
    }
  }, [hasNavigator, isNavigatorEnabled]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", py: 1 }}>
      <label>Navigator</label>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button
        className="btn"
        disabled={!hasNavigator}
        onClick={() => {
          if (!isNavigatorEnabled) {
            setIsNavigatorEnabled(true);
          } else {
            setIsNavigatorEnabled(false);
          }
        }}
      >
        {isNavigatorEnabled ? "ON" : "OFF"}
      </button>
    </Box>
  );
}
