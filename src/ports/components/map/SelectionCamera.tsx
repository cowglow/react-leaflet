import { useEffect } from "react";
import { useMap } from "@vis.gl/react-maplibre";
import { useSelector } from "infrastructure/redux/hooks.ts";
import { getSelectedMemberIds } from "infrastructure/redux/selection/selection.selectors.ts";
import { getMembers } from "infrastructure/redux/member/member.selectors.ts";
import { bbox } from "application/geo/bbox.ts";

// Pans / fits the map to whatever is selected. Only reacts to the selection
// changing (not to member edits), so dragging a selected marker doesn't yank the
// camera back afterwards.
export default function SelectionCamera() {
  const { current: map } = useMap();
  const selectedIds = useSelector(getSelectedMemberIds);
  const members = useSelector(getMembers);

  useEffect(() => {
    if (!map || selectedIds.length === 0) {
      return;
    }
    const selected = new Set(selectedIds);
    const coordinates = members
      .filter((member) => selected.has(member.id) && member.address)
      .map((member) => member.address!.coordinates);

    if (coordinates.length === 0) {
      return;
    }
    if (coordinates.length === 1) {
      const [{ lat, lng }] = coordinates;
      map.easeTo({ center: [lng, lat], zoom: Math.max(map.getZoom(), 13) });
      return;
    }
    const bounds = bbox(coordinates);
    if (bounds) {
      map.fitBounds(bounds, { padding: 80, maxZoom: 15 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, selectedIds]);

  return null;
}
