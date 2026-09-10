import { useEffect } from "react";
import styled from "styled-components";
import ConnectionErrorBanner from "ports/components/ui/ConnectionErrorBanner.tsx";
import { useDispatch, useSelector } from "infrastructure/redux/hooks.ts";
import { fetchMembers } from "infrastructure/redux/member/member.slice.ts";
import { getMemberError } from "infrastructure/redux/member/member.selectors.ts";
import { fetchOrganizations } from "infrastructure/redux/organization/organization.slice.ts";
import { getOrganizationError } from "infrastructure/redux/organization/organization.selectors.ts";
import { openWindow } from "infrastructure/redux/windows/windows.slice.ts";
import { useTranslation } from "ports/context/i18n/i18n.hook.ts";
import ActionMenu from "ports/components/action-menu/ActionMenu.tsx";
import SelectionKeys from "ports/components/selection/SelectionKeys.tsx";

// The desktop menu bar and the connection banner beneath it stay above every
// floating window: a window dragged to the top of the screen tucks under the
// menu bar, classic-Mac style. This sits above DesktopWindow's z-index (100)
// and below the modal dialog backdrop (2000, in dialogs.css).
const DesktopChrome = styled("header")`
  position: relative;
  z-index: 1000;
`;

export default function App() {
  const dispatch = useDispatch();
  const memberError = useSelector(getMemberError);
  const organizationError = useSelector(getOrganizationError);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchMembers());
    dispatch(fetchOrganizations());
    dispatch(openWindow({ type: "MAP_DIALOG" }));
  }, [dispatch]);

  const connectionError = memberError ?? organizationError;

  // No app window chrome — the menu bar sits directly on the desktop and every
  // other surface (the map, dialogs) is a floating DesktopWindow rendered by
  // Dialogs at the viewport level.
  return (
    <DesktopChrome>
      <ActionMenu />
      <SelectionKeys />
      {connectionError && (
        <ConnectionErrorBanner
          message={t.connectionError(connectionError)}
          onRetry={() => {
            dispatch(fetchMembers());
            dispatch(fetchOrganizations());
          }}
        />
      )}
    </DesktopChrome>
  );
}
