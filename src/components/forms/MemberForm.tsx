import { useMarkers } from "hooks/use-markers.ts";

export default function MemberForm() {
  const { enable } = useMarkers();
  return <h1>Member Form {JSON.stringify(enable)}</h1>;
}
