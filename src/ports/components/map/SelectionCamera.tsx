import { useEffect } from "react";
import { useMap } from "@vis.gl/react-maplibre";
import { useSelector } from "infrastructure/redux/hooks.ts";
import { getSelectedMemberIds } from "infrastructure/redux/selection/selection.selectors.ts";
import { getMembers } from "infrastructure/redux/member/member.selectors.ts";
import { bbox } from "application/geo/bbox.ts";

// Nudges the map toward the selection — but only when it changes, only when
// something selected is off-screen, and never by zooming. If the selected
// marker(s) are already visible the camera stays put.
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

    const raw = map.getMap();
    const viewport = raw.getBounds();
    if (coordinates.every(({ lat, lng }) => viewport.contains([lng, lat]))) {
      return; // already in view — leave the camera alone
    }

    if (coordinates.length === 1) {
      const [{ lat, lng }] = coordinates;
      raw.panTo([lng, lat], { duration: 400 });
      return;
    }
    const bounds = bbox(coordinates);
    if (bounds) {
      const center: [number, number] = [
        (bounds[0][0] + bounds[1][0]) / 2,
        (bounds[0][1] + bounds[1][1]) / 2,
      ];
      raw.panTo(center, { duration: 400 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, selectedIds]);

  return null;
}
