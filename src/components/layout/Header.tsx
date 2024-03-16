import styled from "styled-components";
import { useMarkers } from "hooks/use-markers.ts";
import { useTileServer } from "context/tile-server-context/tile-server-context-hook.ts";
import { ChangeEvent } from "react";
import { useTrackPoints } from "hooks/use-track-points.ts";
import { Sheet } from "@mui/joy";
import { ExportController, ImportController } from "feature/cvs";
// import { Box, Breadcrumbs, Button, Link, Typography } from "@mui/joy";
// import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
// import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
// import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";

const StyledHeader = styled(Sheet)`
  display: flex;
  flex-shrink: 1;
  flex-direction: column;
  padding: 2.5%;
  overflow: hidden;
`;

const ControlGroup = styled("div")`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

export default function Header() {
  const { clearTrackPoints } = useTrackPoints();
  const { markers, addMarker, clearMarkers } = useMarkers();
  const { tileServers, setServer } = useTileServer();

  const resetMap = () => {
    clearMarkers();
    clearTrackPoints();
    setServer(0);
    location.reload();
  };

  const selectChangeHandler = ({ target }: ChangeEvent<HTMLSelectElement>) => {
    setServer(parseInt(target.value));
  };

  const dataImportHandler = (data: string[][]) => {
    data.forEach(([lat, lng]) => {
      const position = L.latLng([Number(lat), Number(lng)]);
      addMarker(position);
    });
  };

  return (
    <StyledHeader component="header">
      <h1>Vite + React-Leaflet</h1>
      <ControlGroup>
        <ExportController label="Export Markers as CSV" data={markers} />
        <ImportController
          label="Import Markers from CSV"
          onLoad={dataImportHandler}
        />
        <ControlGroup>
          <select onChange={selectChangeHandler}>
            {tileServers.map((tileServer, index) => (
              <option key={index} value={index}>
                {tileServer.label}
              </option>
            ))}
          </select>
          <button onClick={resetMap}>Reset</button>
        </ControlGroup>
      </ControlGroup>
    </StyledHeader>
  );

  // return (
  //   <StyledHeader>
  //     <h1>Vite + React-Leaflet</h1>
  //     <div>
  //       <ExportController label="Export MarkerDefault Coords" data={markers} />
  //       <button onClick={resetMap}>Reset</button>
  //       <select onChange={selectChangeHandler}>
  //         {tileServers.map((tileServer, index) => (
  //           <option key={index} value={index}>
  //             {tileServer.label}
  //           </option>
  //         ))}
  //       </select>
  //     </div>
  //   </StyledHeader>
  // );
}
