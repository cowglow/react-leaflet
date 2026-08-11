import { PropsWithChildren } from "react";
import styled from "styled-components";
import { useTranslation } from "ports/context/i18n/i18n.hook.ts";

const StyledWindow = styled("main")`
  position: relative;
  display: flex;
  flex-direction: column;
  width: auto;
  height: calc(100svh - 38px);
`;

const StyledWindowContent = styled("div")`
  position: relative;
  flex: 1;
  overflow: hidden;
`;

export default function MainLayout({ children }: PropsWithChildren) {
  const { t } = useTranslation();

  return (
    <StyledWindow className="window scale-down">
      <div className="title-bar">
        <h1 className="title">{t.layout.title}</h1>
      </div>
      <div className="separator" />
      <StyledWindowContent>{children}</StyledWindowContent>
    </StyledWindow>
  );
}