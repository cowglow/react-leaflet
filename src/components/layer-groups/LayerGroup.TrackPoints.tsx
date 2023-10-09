import LayerGroupDefault from "components/layer-groups/LayerGroup.Default.tsx";
import {
  useAircraftTrackPointsContext
} from "context/aircraft-track-points-context/aircraft-track-points-context-hook.ts";
import MarkerAircraft from "components/markers/Marker.Aircraft.tsx";

import "./track-point.styles.css";
import { calculateBearing } from "feature/map/helper.ts";

function addBearingsToTrackPoints(trackPoints) {
  return trackPoints.map((trackPoint, i, array) => {
    const nextPoint = array[(i + 1) % array.length];
    return {
      position: trackPoint,
      bearing: calculateBearing(trackPoint, nextPoint)
    };
  });
}

export default function LayerGroupTrackPoints() {
  const { trackPoints } = useAircraftTrackPointsContext();

  const trackPointsWithBearings = addBearingsToTrackPoints(trackPoints);

  return (
    <LayerGroupDefault>
      {trackPointsWithBearings.map(({ bearing, position }, index) => (
        <MarkerAircraft key={index} bearing={bearing} position={position} draggable={false} />
      ))}
    </LayerGroupDefault>
  );
}
