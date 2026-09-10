import { useEffect } from "react";
import { useMap } from "react-leaflet";

// Leaflet caches its container's pixel size and only re-measures it on a window
// `resize` event. When the map's container changes size for any other reason —
// the desktop window being zoomed/restored, or (later) resized — the tiles and
// the pan/zoom math keep the stale size until we tell Leaflet to re-measure. A
// ResizeObserver on the map container catches every such case; the rAF guard
// collapses a burst of observer callbacks into a single invalidateSize.
export default function MapAutoResize() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    let frame = 0;

    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => map.invalidateSize({ animate: false }));
    });

    observer.observe(container);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [map]);

  return null;
}
