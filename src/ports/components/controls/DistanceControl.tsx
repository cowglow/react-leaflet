import { useState } from "react";
import { Paper } from "@mui/material";
import { useSelector } from "infrastructure/redux/hooks.ts";
import { getMembersWithAddress } from "infrastructure/redux/member/member.selectors.ts";
import { calculateDistance } from "application/geo/distance.ts";
import useGeoLocation from "ports/hooks/use-geo-location.ts";
import type { GeoCoordinate } from "domain/marker/geo-coordinate.ts";
import { useTranslation } from "ports/context/i18n/i18n.hook.ts";

const MY_LOCATION = "__my_location__";

export default function DistanceControl() {
  const { t } = useTranslation();
  const members = useSelector(getMembersWithAddress);
  const [originId, setOriginId] = useState("");
  const { location: myLocation, error: geoError, loading: geoLoading } = useGeoLocation(
    originId === MY_LOCATION,
  );

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
      <label htmlFor="distance-origin">{t.distanceControl.distanceFrom}</label>
      <br />
      <select
        id="distance-origin"
        value={originId}
        onChange={(event) => setOriginId(event.target.value)}
      >
        <option value="">{t.distanceControl.select}</option>
        <option value={MY_LOCATION}>{t.distanceControl.myLocation}</option>
        {members.map((member) => (
          <option key={member.id} value={member.id}>
            {member.name.firstName} {member.name.lastName}
          </option>
        ))}
      </select>
      {originId === MY_LOCATION && geoLoading && <p>{t.distanceControl.gettingLocation}</p>}
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
