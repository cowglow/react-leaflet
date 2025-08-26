import styled from "styled-components";

export const StyledZoomControls = styled("div")`
  display: flex;
  //flex-direction: column;
  gap: 0.33rem;

  & > button,
  button:disabled {
    display: flex;
    padding: 0;
    min-height: unset;
    min-width: unset;
    border-radius: 30%;
  }
`;
