import styled from "styled-components";
import { Sheet } from "@mui/joy";

const StyledFooter = styled(Sheet)`
  display: flex;
  justify-content: flex-end;
  padding: 1.25% 2.5%;
`;

export default function Footer() {
  return (
    <footer>
      <StyledFooter>
        <a href="https://github.com/cowglow/react-leaflet" target="_blank">
          Git Repo
        </a>
      </StyledFooter>
    </footer>
  );
}
