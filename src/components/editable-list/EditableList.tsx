import { memo, useEffect, useState } from "react";
import createEditableListControl from "components/editable-list/create-editable-list-control.ts";
import { useMap } from "react-leaflet";
import { createPortal } from "react-dom";
import { Box } from "@mui/material";

interface EditableListProps {
  data: Record<number, string>;
}

function EditableList(props: EditableListProps) {
  const [container, setContainer] = useState<HTMLDivElement>(
    document.createElement("div"),
  );

  const map = useMap();
  useEffect(() => {
    const target = document.getElementsByClassName("leaflet-bottom");
    if (target) setContainer(target[0] as HTMLDivElement);

    const control = createEditableListControl({
      position: "bottomleft",
    });
    map.addControl(control);
    return () => {
      map.removeControl(control);
    };
  }, []);

  return createPortal(
    <Box bgcolor="red">
      <h1>Editable List</h1>
      <pre>{JSON.stringify({ props }, null, 2)}</pre>
    </Box>,
    container,
  );
}

export default memo(EditableList);
