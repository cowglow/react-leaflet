import { useSelector } from "redux-store/hooks.ts";
import { isEnabled } from "../../redux-store/store/marker/marker-selectors.ts";

export default function MemberForm() {
  const enable = useSelector(isEnabled);
  return <h1>Member Form {JSON.stringify(enable)}</h1>;
}
