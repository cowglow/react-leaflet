interface AircraftTrackPointsContextProps {
  trackPoints: L.LatLng[];
}

type AircraftTrackPointsContextApi = {
  addTrackPoint: (position: L.LatLng) => void
  clearTrackPoints: () => void
} & AircraftTrackPointsContextProps
