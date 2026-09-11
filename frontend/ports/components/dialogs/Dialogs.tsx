import { useDispatch, useSelector } from "infrastructure/redux/hooks.ts";
import { getOpenWindows } from "infrastructure/redux/windows/windows.selectors.ts";
import { closeWindow, DialogType } from "infrastructure/redux/windows/windows.slice.ts";
import { dialogConfig } from "ports/config/dialog.config.tsx";
import "./dialogs.css";

// These render their own draggable DesktopWindow chrome and sit directly on the
// desktop; the rest get a centered modal backdrop.
const WINDOWED: ReadonlySet<DialogType> = new Set<DialogType>([
  "MAP_DIALOG",
  "ORGANIZATION_DIALOG",
  "ORGANIZATION_TREE_DIALOG",
]);

export default function Dialogs() {
  const dispatch = useDispatch();
  const windows = useSelector(getOpenWindows);

  return (
    <>
      {windows.map((window) =>
        WINDOWED.has(window.type) ? (
          <div key={window.id}>{dialogConfig[window.type](window.payload, window.z)}</div>
        ) : (
          <div
            key={window.id}
            className="dialog-backdrop"
            onClick={() => dispatch(closeWindow(window.id))}
          >
            <div onClick={(event) => event.stopPropagation()}>
              {dialogConfig[window.type](window.payload)}
            </div>
          </div>
        ),
      )}
    </>
  );
}
