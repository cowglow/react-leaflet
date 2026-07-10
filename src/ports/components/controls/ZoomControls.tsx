import { useMap } from "react-leaflet";
import { useCallback } from "react";
import PlusIcon from "@mui/icons-material/Add";
import MinusIcon from "@mui/icons-material/Remove";
import { StyledZoomControls } from "ports/components/controls/ZoomControls.Styled.tsx";
import { useTranslation } from "ports/context/i18n/i18n.hook.ts";

export default function ZoomControls() {
  const map = useMap();
  const { t } = useTranslation();

  const zoom = useCallback(
    (direction: "in" | "out") => {
      switch (direction) {
        case "in":
          map.zoomIn();
          break;
        case "out":
          map.zoomOut();
          break;
        default:
          map.zoomIn();
      }
    },
    [map],
  );

  return (
    <StyledZoomControls>
      <label htmlFor="filterRange">{t.mapControls.zoomControls}</label>
      <button className="btn" onClick={() => zoom("in")}>
        <PlusIcon />
      </button>
      <button className="btn" onClick={() => zoom("out")}>
        <MinusIcon />
      </button>
    </StyledZoomControls>
  );
}