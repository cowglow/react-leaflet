import { useMap } from "react-leaflet";
import { useEffect } from "react";
import { useSelector } from "infrastructure/redux/hooks.ts";
import { getMembersWithAddress } from "infrastructure/redux/member/member.selectors.ts";

interface MapBoundsProps {
  disableZoom: boolean;
}

export default function MapBounds({ disableZoom = false }: MapBoundsProps) {
  const members = useSelector(getMembersWithAddress);
  const map = useMap();

  useEffect(() => {
    const coordinates = members.map((member) => member.address!.coordinates);
    const bounds = L.latLngBounds(coordinates);
    if (bounds.isValid() && !disableZoom && coordinates.length > 5) {
      map.fitBounds(bounds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members]);

  return null;
}
