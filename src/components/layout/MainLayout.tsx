import { ReactNode } from "react";
import styled from "styled-components";
import Footer from "components/layout/Footer.tsx";
import Header from "components/layout/Header.tsx";
import { Sheet } from "@mui/joy";

const StyledWrapper = styled(Sheet)`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
`;

const StyledMain = styled("main")`
  //border: solid magenta;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <StyledWrapper>
      <Header />
      <StyledMain>{children}</StyledMain>
      <Footer />
    </StyledWrapper>
  );
}
