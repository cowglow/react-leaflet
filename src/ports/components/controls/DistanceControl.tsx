import { useState } from "react";
import { Paper } from "@mui/material";
import { useSelector } from "infrastructure/redux/hooks.ts";
import { getMembersWithAddress } from "infrastructure/redux/member/member.selectors.ts";
import { calculateDistance } from "application/geo/distance.ts";
import useGeoLocation from "ports/hooks/use-geo-location.ts";
import type { GeoCoordinate } from "domain/marker/geo-coordinate.ts";

const MY_LOCATION = "__my_location__";

export default function DistanceControl() {
  const members = useSelector(getMembersWithAddress);
  const [originId, setOriginId] = useState("");
  const { location: myLocation, error: geoError, loading: geoLoading } = useGeoLocation();

  const origin: GeoCoordinate | undefined =
    originId === MY_LOCATION
      ? (myLocation ?? undefined)
      : members.find((member) => member.id === originId)?.address?.coordinates;

  const distances = origin
    ? members
        .filter((member) => member.id !== originId)
        .map((member) => ({
          member,
          distanceKm: calculateDistance(origin, member.address!.coordinates),
        }))
        .sort((a, b) => a.distanceKm - b.distanceKm)
    : [];

  return (
    <Paper className="standard-dialog" elevation={2} sx={{ minWidth: "220px" }}>
      <label htmlFor="distance-origin">Distance from</label>
      <br />
      <select
        id="distance-origin"
        value={originId}
        onChange={(event) => setOriginId(event.target.value)}
      >
        <option value="">— Select —</option>
        <option value={MY_LOCATION}>My Location</option>
        {members.map((member) => (
          <option key={member.id} value={member.id}>
            {member.name.firstName} {member.name.lastName}
          </option>
        ))}
      </select>
      {originId === MY_LOCATION && geoLoading && <p>Getting your location…</p>}
      {originId === MY_LOCATION && geoError && <p>{geoError}</p>}
      {origin && (
        <ul>
          {distances.map(({ member, distanceKm }) => (
            <li key={member.id}>
              {member.name.firstName} {member.name.lastName} — {distanceKm.toFixed(1)} km
            </li>
          ))}
        </ul>
      )}
    </Paper>
  );
}
