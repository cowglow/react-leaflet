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
        <h1 className="title">Visual Directory (Vite + React + TS)</h1>
      </div>
      <div className="separator" />
      <StyledWindowContent>{children}</StyledWindowContent>
    </StyledWindow>
  );
}