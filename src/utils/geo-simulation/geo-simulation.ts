// geo-sim.ts
import { route } from "./coords";

export function installGeoSim(speedMs = 1000) {
  let idx = 0;
  const watchers = new Map<number, PositionCallback>();
  let watchId = 1;
  let timer: ReturnType<typeof setInterval> | null = null;

  function emit() {
    const point = route[idx];
    if (!point) {
      if (timer) clearInterval(timer);
      return;
    }

    // Create a GeolocationPosition with proper toJSON
    const pos: GeolocationPosition = {
      coords: {
        latitude: point.latitude,
        longitude: point.longitude,
        accuracy: 5,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
        toJSON: () => ({
          latitude: this.latitude,
          longitude: this.longitude,
          accuracy: this.accuracy,
          altitude: this.altitude,
          altitudeAccuracy: this.altitudeAccuracy,
          heading: this.heading,
          speed: this.speed,
        }),
      },
      timestamp: Date.now(),
      toJSON: () => ({
        latitude: this.latitude,
        longitude: this.longitude,
        accuracy: this.accuracy,
        altitude: this.altitude,
        altitudeAccuracy: this.altitudeAccuracy,
        heading: this.heading,
        speed: this.speed,
      }),
    };

    watchers.forEach((cb) => cb(pos));
    idx = (idx + 1) % route.length;
  }

  const shim: Geolocation = {
    getCurrentPosition(success: PositionCallback) {
      // Immediately return the current position
      const point = route[idx];
      const pos: GeolocationPosition = {
        coords: {
          latitude: point.latitude,
          longitude: point.longitude,
          accuracy: 5,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
          toJSON() {
            return {
              latitude: this.latitude,
              longitude: this.longitude,
              accuracy: this.accuracy,
              altitude: this.altitude,
              altitudeAccuracy: this.altitudeAccuracy,
              heading: this.heading,
              speed: this.speed,
            };
          },
        },
        timestamp: Date.now(),
        toJSON: function () {
          throw new Error("Function not implemented.");
        },
      };
      success(pos);
    },
    watchPosition(success: PositionCallback) {
      const id = watchId++;
      watchers.set(id, success);
      if (!timer) {
        timer = setInterval(emit, speedMs);
      }
      return id;
    },
    clearWatch(id: number) {
      watchers.delete(id);
      if (watchers.size === 0 && timer) {
        clearInterval(timer);
        timer = null;
      }
    },
  };

  if (import.meta.env.DEV) {
    Object.defineProperty(navigator, "geolocation", {
      value: shim,
      configurable: true,
    });
    console.log("GeoSim installed (dev only)");
  }
}
