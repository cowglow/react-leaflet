import type { Meta, StoryObj } from "@storybook/react";
import L from "leaflet";
import Map from "ports/components/map/Map.tsx";
import MarkerOwnPosition from "ports/components/markers/Marker.OwnPosition.tsx";
import MemberMarker from "ports/components/markers/Marker.Member.tsx";
import AircraftMarker from "ports/components/markers/Marker.Aircraft.tsx";
import { sampleMembers } from "ports/testing/story-fixtures.ts";

const reduxState = {
  member: { items: sampleMembers, filteredLimit: sampleMembers.length, loading: false, error: null },
  auth: {
    status: "authenticated",
    account: { id: "account-1", email: "leader@example.com", role: "leader" },
    error: null,
  },
};

const meta: Meta<typeof Map> = {
  title: "ports/map/Map",
  component: Map,
  // Map renders its own MapContainer internally, so this does NOT use the
  // `map: true` decorator parameter (that would nest a second MapContainer).
  // Map's wrapper relies on height:100% cascading down from its parent, which
  // collapses to 0 in the story canvas unless we give it a concrete height here.
  decorators: [
    (Story) => (
      <div style={{ height: "400px", width: "100%" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    center: new L.LatLng(49.4521, 11.0767),
    zoom: 13,
    scrollWheelZoom: true,
  },
  parameters: { reduxState },
};

export default meta;
type Story = StoryObj<typeof Map>;

export const WithMembersAndAircraft: Story = {
  args: {
    children: (
      <>
        <MarkerOwnPosition />
        <AircraftMarker position={new L.LatLng(49.46, 11.09)} bearing={220} />
        {sampleMembers.map((member) => (
          <MemberMarker key={member.id} member={member} />
        ))}
      </>
    ),
  },
};
