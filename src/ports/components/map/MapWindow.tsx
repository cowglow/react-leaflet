import DesktopWindow from "ports/components/windows/DesktopWindow.tsx";
import MembersMap from "ports/components/map/MembersMap.tsx";
import { useDispatch } from "infrastructure/redux/hooks.ts";
import { closeWindow } from "infrastructure/redux/windows/windows.slice.ts";
import { useTranslation } from "ports/context/i18n/i18n.hook.ts";

export default function MapWindow() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  return (
    // Dialogs renders every window at the viewport level, so DesktopWindow's
    // position is relative to the viewport. Offset it down enough to clear the
    // desktop menu bar instead of spawning underneath it.
    <DesktopWindow
      title={t.mapWindow.title}
      initialPosition={{ x: 24, y: 44 }}
      onClose={() => dispatch(closeWindow("MAP_DIALOG"))}
    >
      <MembersMap />
    </DesktopWindow>
  );
}
