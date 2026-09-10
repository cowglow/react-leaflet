import { useDispatch, useSelector } from "infrastructure/redux/hooks.ts";
import { getOpenWindows } from "infrastructure/redux/windows/windows.selectors.ts";
import { closeWindow } from "infrastructure/redux/windows/windows.slice.ts";
import { dialogConfig } from "ports/config/dialog.config.tsx";
import "./dialogs.css";

export default function Dialogs() {
  const dispatch = useDispatch();
  const windows = useSelector(getOpenWindows);

  return (
    <>
      {windows.map((window) =>
        window.type === "MAP_DIALOG" ? (
          <div key={window.id}>{dialogConfig[window.type](window.payload)}</div>
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
