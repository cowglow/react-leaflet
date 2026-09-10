import { useEffect } from "react";
import { useMap } from "@vis.gl/react-maplibre";
import { useSelector } from "infrastructure/redux/hooks.ts";
import { getSelectedMemberIds } from "infrastructure/redux/selection/selection.selectors.ts";
import { getMembers } from "infrastructure/redux/member/member.selectors.ts";
import { bbox } from "application/geo/bbox.ts";

// Centres the map on the selection whenever it changes — the selected marker for
// a single pick, the group's centre for several. Never changes zoom, and (thanks
// to the slice's no-op guard) re-selecting the same set doesn't move the camera.
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

    let target: [number, number];
    if (coordinates.length === 1) {
      target = [coordinates[0].lng, coordinates[0].lat];
    } else {
      const bounds = bbox(coordinates);
      if (!bounds) return;
      target = [(bounds[0][0] + bounds[1][0]) / 2, (bounds[0][1] + bounds[1][1]) / 2];
    }
    map.getMap().panTo(target, { duration: 400 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, selectedIds]);

  return null;
}
