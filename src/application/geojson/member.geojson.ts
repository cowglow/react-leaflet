import type { Member } from "domain/member/member.types.ts";

// Minimal GeoJSON typings (RFC 7946) — the export only ever emits a
// FeatureCollection whose features are Points, or null-geometry features for
// members that haven't been placed on the map yet.
export type GeoJSONPoint = { type: "Point"; coordinates: [number, number] };

export type MemberFeature = {
  type: "Feature";
  geometry: GeoJSONPoint | null;
  properties: Member;
};

export type MemberFeatureCollection = {
  type: "FeatureCollection";
  features: MemberFeature[];
};

export function memberToFeature(member: Member): MemberFeature {
  return {
    type: "Feature",
    // GeoJSON coordinates are [longitude, latitude] — the reverse of Leaflet's
    // LatLng. A member with no address hasn't been placed yet: emit a null
    // geometry (valid per RFC 7946 §3.2) so the export stays lossless.
    geometry: member.address
      ? {
          type: "Point",
          coordinates: [member.address.coordinates.lng, member.address.coordinates.lat],
        }
      : null,
    properties: member,
  };
}

export function membersToGeoJSON(members: Member[]): MemberFeatureCollection {
  return {
    type: "FeatureCollection",
    features: members.map(memberToFeature),
  };
}
