import { ReactNode } from "react";
import styled from "styled-components";
import ExportController from "../ExportController.tsx";
import { useMarkers } from "../../hooks/use-markers.ts";

const StyledWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
`;

const StyleHeader = styled("header")`
  display: flex;
  justify-content: space-between;
  border: thick solid greenyellow;
  padding: 0 2rem 0;
`;

const StyledMain = styled("main")`
  display: block;
  flex-grow: 1;
`;

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { markers } = useMarkers();
  return (
    <StyledWrapper>
      <StyleHeader>
        <h1>Vite + React</h1>
        <ExportController label="Export Marker Coords" data={markers} />
      </StyleHeader>
      <StyledMain>{children}</StyledMain>
      <footer>GitHub Repo</footer>
    </StyledWrapper>
  );
}
