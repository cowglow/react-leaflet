import { CREATE_MEMBER } from "context/redux-store/actions/member/member-action-types.ts";
import { useDialogContext } from "context/app-dialog-context/app-dialog-context-hook.ts";
import { CREATE_ORGANIZATION } from "context/redux-store/actions/organization/organization-action-type.ts";
// import { createMemberAction } from "context/redux-store/actions/member/member-actions.ts";

export default function useActionMenu() {
  const { openDialog } = useDialogContext();
  const handleAction = (action) => {
    switch (action) {
      case CREATE_MEMBER:
        openDialog("MEMBER_DIALOG");
        // dispatchEvent(createMemberAction({ name: "New Member" }));
        // dispatchEvent(createMemberAction({ name: "New Member" }));
        break;
      case CREATE_ORGANIZATION:
        openDialog("ORGANIZATION_DIALOG");
        break;
      default:
        console.log("Unknown Action");
    }
  };
  return {
    handleAction,
  };
}
