import styled from "styled-components";

export const StyledFileInput = styled("input")`
  display: none;
`;
export const StyledFileInputLabel = styled("label")`
  padding: 0;
  margin: 0;

  & div {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
    border: thin solid black;
    width: 34px;
    height: 34px;
    border-radius: 20%;

    & :hover {
      cursor: pointer;
    }
  }
`;
