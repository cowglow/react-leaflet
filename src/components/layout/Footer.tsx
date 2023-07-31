import styled from "styled-components";

const StyledFooter = styled("footer")`
  display: flex;
  justify-content: flex-end;
  padding: 2rem;
  color: white;
`;

export default function Footer() {
  return (
    <StyledFooter>
      <a href="https://github.com/cowglow/react-leaflet" target="_blank">
        Git Repo
      </a>
    </StyledFooter>
  );
}
