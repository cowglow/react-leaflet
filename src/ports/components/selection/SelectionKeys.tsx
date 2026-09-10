import { useEffect } from "react";
import { useDispatch, useSelector } from "infrastructure/redux/hooks.ts";
import { hasSelection } from "infrastructure/redux/selection/selection.selectors.ts";
import { clearSelection } from "infrastructure/redux/selection/selection.slice.ts";

// Esc clears the current selection, from anywhere.
export default function SelectionKeys() {
  const dispatch = useDispatch();
  const selectionActive = useSelector(hasSelection);

  useEffect(() => {
    if (!selectionActive) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dispatch(clearSelection());
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dispatch, selectionActive]);

  return null;
}
