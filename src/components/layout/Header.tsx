import styled from "styled-components";
import ExportController from "components/ExportController.tsx";
import { useMarkers } from "hooks/use-markers.ts";
import { useTileServer } from "context/tile-server-context/tile-server-context-hook.ts";
import { ChangeEvent } from "react";
import { useTrackPoints } from "hooks/use-track-points.ts";
import { Sheet } from "@mui/joy";
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
  const { markers, clearMarkers } = useMarkers();
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

  return (
    <header>
      <StyledHeader>
        <h1>Vite + React-Leaflet</h1>
        <ControlGroup>
          <ExportController
            label="Export MarkerDefault Coords"
            data={markers}
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
    </header>
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
