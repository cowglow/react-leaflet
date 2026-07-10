import type { Meta, StoryObj } from "@storybook/react";
import OrganizationTree from "ports/components/organization-tree/OrganizationTree.tsx";
import { sampleMembers, sampleOrganizations } from "ports/testing/story-fixtures.ts";
import type { Organization } from "domain/organization/organization.types.ts";

const meta: Meta<typeof OrganizationTree> = {
  title: "ports/organization-tree/OrganizationTree",
  component: OrganizationTree,
};

export default meta;
type Story = StoryObj<typeof OrganizationTree>;

export const Default: Story = {
  parameters: {
    reduxState: {
      member: { items: sampleMembers, filteredLimit: sampleMembers.length, loading: false, error: null },
      organization: { items: sampleOrganizations, loading: false, error: null },
    },
  },
};

const allTypesOrganizations: Organization[] = [
  { id: "org-region-1", name: "Central Region", type: "Region", members: [] },
  { id: "org-hq-1", name: "Northeast Headquarters", type: "Headquarter", members: [] },
  ...sampleOrganizations,
  { id: "org-district-2", name: "Empty District", type: "District", members: [] },
];

export const AllOrganizationTypes: Story = {
  parameters: {
    reduxState: {
      member: { items: sampleMembers, filteredLimit: sampleMembers.length, loading: false, error: null },
      organization: { items: allTypesOrganizations, loading: false, error: null },
    },
  },
};

export const NoOrganizations: Story = {
  parameters: {
    reduxState: {
      member: { items: [], filteredLimit: 0, loading: false, error: null },
      organization: { items: [], loading: false, error: null },
    },
  },
};
