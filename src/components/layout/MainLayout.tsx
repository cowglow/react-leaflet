import { ReactNode } from "react";
import styled from "styled-components";
import Footer from "components/layout/Footer.tsx";
import Header from "components/layout/Header.tsx";

const StyledWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
  border: 0.42em solid #61BA9E;
`;


const StyledMain = styled("main")`
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
