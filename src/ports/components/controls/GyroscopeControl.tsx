import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "infrastructure/redux/hooks.ts";
import {
  getGyroscopeAlpha,
  getGyroscopeEnabled,
} from "infrastructure/redux/gyroscope/gyroscope.selectors.ts";
import {
  disableGyroscope,
  enableGyroscope,
  setAlpha,
} from "infrastructure/redux/gyroscope/gyroscope.slice.ts";

export default function GyroscopeControl() {
  const map = useMap();
  const dispatch = useDispatch();

  const hasGyroscope = "DeviceOrientationEvent" in window;
  const isGyroscopeEnabled = useSelector(getGyroscopeEnabled);
  const alpha = useSelector(getGyroscopeAlpha);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const alpha = event.alpha;
      if (alpha !== null) {
        map.getContainer().style.transform = `rotate(${alpha}deg)`;
        dispatch(setAlpha(alpha));
      }
    };

    if (hasGyroscope && isGyroscopeEnabled) {
      window.addEventListener("deviceorientation", handleOrientation);
    } else {
      console.warn("DeviceOrientationEvent is not supported on this device.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasGyroscope, isGyroscopeEnabled, map]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", py: 1 }}>
      <label>Gyroscope: {String(alpha)}</label>
      <button
        className="btn"
        disabled={!hasGyroscope}
        onClick={() => {
          if (!isGyroscopeEnabled) {
            dispatch(enableGyroscope());
          } else {
            dispatch(disableGyroscope());
          }
        }}
      >
        {isGyroscopeEnabled ? "ON" : "OFF"}
      </button>
    </Box>
  );
}