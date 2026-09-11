import type { Meta, StoryObj } from "@storybook/react";
import Map from "ports/components/map/Map.tsx";
import MarkerOwnPosition from "ports/components/markers/Marker.OwnPosition.tsx";
import MemberMarker from "ports/components/markers/Marker.Member.tsx";
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
  // Map renders its own MapLibre <Map> — do NOT use `parameters: { map: true }`
  // (that nests a second map). Its flex wrapper needs a sized flex parent, which
  // the bare story canvas doesn't provide.
  decorators: [
    (Story) => (
      <div style={{ height: "400px", width: "100%", display: "flex" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    center: { longitude: 11.0767, latitude: 49.4521 },
    zoom: 13,
    scrollZoom: true,
  },
  parameters: { reduxState },
};

export default meta;
type Story = StoryObj<typeof Map>;

export const WithMembers: Story = {
  args: {
    children: (
      <>
        <MarkerOwnPosition />
        {sampleMembers.map((member) => (
          <MemberMarker key={member.id} member={member} />
        ))}
      </>
    ),
  },
};
