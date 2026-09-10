import { useMap } from "@vis.gl/react-maplibre";
import { useEffect } from "react";
import { useSelector } from "infrastructure/redux/hooks.ts";
import { getMembersWithAddress } from "infrastructure/redux/member/member.selectors.ts";
import { bbox } from "application/geo/bbox.ts";

interface MapBoundsProps {
  disableZoom: boolean;
}

export default function MapBounds({ disableZoom = false }: MapBoundsProps) {
  const members = useSelector(getMembersWithAddress);
  const { current: map } = useMap();

  useEffect(() => {
    if (!map || disableZoom) {
      return;
    }
    const coordinates = members.map((member) => member.address!.coordinates);
    if (coordinates.length <= 5) {
      return;
    }
    const bounds = bbox(coordinates);
    if (bounds) {
      map.fitBounds(bounds, { padding: 40, animate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members, map]);

  return null;
}
