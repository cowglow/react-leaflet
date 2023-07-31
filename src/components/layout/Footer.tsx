import styled from "styled-components";
import { useMarkers } from "hooks/use-markers.ts";

const StyledFooter = styled("footer")`
  display: flex;
  justify-content: space-between;
  padding: 2rem;
  color: white;
`;

export default function Footer() {
  const { markers } = useMarkers();
  return (
    <StyledFooter>
      <pre style={{ color: "white", fontSize: "1.235em" }}>{JSON.stringify({ markers: markers.length })}</pre>
      <a href="https://github.com/cowglow/react-leaflet" target="_blank">
        Git Repo
      </a>
    </StyledFooter>
  );
}
