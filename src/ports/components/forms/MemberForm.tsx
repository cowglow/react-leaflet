import { useSelector } from "infrastructure/redux/hooks.ts";
import { isEnabled } from "infrastructure/redux/marker/marker.selectors.ts";

export default function MemberForm() {
  const enable = useSelector(isEnabled);
  return <h1>Member Form {JSON.stringify(enable)}</h1>;
}