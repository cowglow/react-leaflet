import { useMap } from "@vis.gl/react-maplibre";
import { useEffect, useRef } from "react";
import { useSelector } from "infrastructure/redux/hooks.ts";
import { getMembersWithAddress } from "infrastructure/redux/member/member.selectors.ts";
import { bbox } from "application/geo/bbox.ts";

interface MapBoundsProps {
  disableZoom: boolean;
}

// Frames every member once, when they first load — a "here's everyone" opening
// shot. After that the camera belongs to the user and to SelectionCamera.
export default function MapBounds({ disableZoom = false }: MapBoundsProps) {
  const members = useSelector(getMembersWithAddress);
  const { current: map } = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    if (fitted.current || !map || disableZoom) {
      return;
    }
    const coordinates = members.map((member) => member.address!.coordinates);
    if (coordinates.length <= 5) {
      return;
    }
    const bounds = bbox(coordinates);
    if (bounds) {
      map.fitBounds(bounds, { padding: 40, animate: false });
      fitted.current = true;
    }
  }, [members, map, disableZoom]);

  return null;
}
