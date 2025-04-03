import { PropsWithChildren } from "react";
import styled from "styled-components";

const StyledWindow = styled("main")`
  position: relative;
  display: flex;
  flex-direction: column;
  width: auto;
  height: calc(100svh - 38px);
`;

const StyledWindowContent = styled("div")`
  flex: 1;
`;

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <StyledWindow className="window scale-down">
      <div className="title-bar">
        {/*<button aria-label="Close" class="close"></button>*/}
        <h1 className="title">React Leaflet (Vite + React + TS)</h1>
        {/*<button aria-label="Resize" class="resize"></button>*/}
      </div>
      <div className="separator" />
      <StyledWindowContent>{children}</StyledWindowContent>
    </StyledWindow>
  );
}
