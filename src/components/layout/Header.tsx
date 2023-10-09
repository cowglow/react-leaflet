import styled from "styled-components";
import ExportController from "components/ExportController.tsx";
import { useMarkers } from "hooks/use-markers.ts";
import { useTileServer } from "context/tile-server-context/tile-server-context-hook.ts";
import { ChangeEvent } from "react";
import { useTrackPoints } from "hooks/use-track-points.ts";

const StyledHeader = styled("header")`
  display: flex;
  justify-content: space-between;
  padding: 0 2rem 0;

  & div {
    display: flex;
    gap: 2rem;
    padding: 2rem;
  }
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
    <StyledHeader>
      <h1>Vite + React-Leaflet</h1>
      <div>
        <ExportController label="Export MarkerDefault Coords" data={markers} />
        <button onClick={resetMap}>Reset</button>
        <select onChange={selectChangeHandler}>
          {tileServers.map((tileServer, index) => <option key={index} value={index}>{tileServer.label}</option>)}
        </select>
      </div>
    </StyledHeader>
  );
}