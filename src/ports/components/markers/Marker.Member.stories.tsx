import type { Meta, StoryObj } from "@storybook/react";
import MemberMarker from "ports/components/markers/Marker.Member.tsx";
import { sampleMembers } from "ports/testing/story-fixtures.ts";

const leaderState = {
  auth: {
    status: "authenticated",
    account: { id: "account-1", email: "leader@example.com", role: "leader" },
    error: null,
  },
};

const memberState = {
  auth: {
    status: "authenticated",
    account: { id: "account-2", email: "member@example.com", role: "member" },
    error: null,
  },
};

const meta: Meta<typeof MemberMarker> = {
  title: "ports/markers/Marker.Member",
  component: MemberMarker,
  parameters: { map: true },
};

export default meta;
type Story = StoryObj<typeof MemberMarker>;

export const ActiveAsLeader: Story = {
  args: { member: sampleMembers[0] },
  parameters: { reduxState: leaderState },
};

export const LostContactAsLeader: Story = {
  args: { member: sampleMembers[1] },
  parameters: { reduxState: leaderState },
};

export const ReadOnlyAsMember: Story = {
  args: { member: sampleMembers[0] },
  parameters: { reduxState: memberState },
};
