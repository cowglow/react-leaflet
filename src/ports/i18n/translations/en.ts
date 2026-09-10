const en = {
  common: {
    save: "Save",
    cancel: "Cancel",
    close: "Close",
    resize: "Resize",
    edit: "Edit",
    remove: "Remove",
    delete: "Delete",
    retry: "Retry",
  },
  organizationTypes: {
    Region: "Region",
    Headquarter: "Headquarter",
    Area: "Area",
    District: "District",
  },
  mapWindow: {
    title: "Map",
  },
  menu: {
    file: "File",
    actions: "Actions",
    about: "About",
    language: "Language",
    import: "Import",
    exportCsv: "Export as CSV",
    exportGeoJson: "Export as GeoJSON",
    addOrganization: "Add Organization",
    inviteAccount: "Invite Account",
    organizations: "Organizations",
    systemCss: "system.css",
    sakunsTwitter: "sakun's twitter",
    githubRepo: "GitHub Repo",
    map: "Map",
  },
  auth: {
    signIn: "Sign in",
    email: "Email",
    sendLoginLink: "Send login link",
    linkSent:
      "If that email has an account, a login link has been sent. Check your inbox (or the server console in dev).",
    genericError: "Something went wrong. Please try again.",
    loading: "Loading…",
    cantConnect: "Can't connect",
  },
  connectionError: (message: string) => `Couldn't load data: ${message}`,
  connectionErrorBanner: {
    retry: "Retry",
  },
  memberForm: {
    addTitle: "Add Member",
    editTitle: "Edit Member",
    noLocation:
      "No location selected. Close this and click the map to place a new member.",
    firstName: "First name",
    lastName: "Last name",
    street: "Street",
    number: "No.",
    zip: "ZIP",
    city: "City",
    telephone: "Telephone",
    email: "Email",
    organization: "Organization",
    unassigned: "— Unassigned —",
    lostContact: "Lost contact",
    lastKnownActive: "Last known active",
    saveFailed: "Failed to save member",
    removeFailed: "Failed to remove member",
    confirmRemoveTitle: "Remove Member?",
    confirmRemoveMessage: (name: string) =>
      `Remove ${name}? This cannot be undone.`,
  },
  organizationForm: {
    title: "Add Organization",
    name: "Name",
    type: "Type",
    saveFailed: "Failed to save organization",
  },
  inviteForm: {
    title: "Invite Account",
    email: "Email",
    role: "Role",
    roleMember: "Member (read-only)",
    roleLeader: "Leader (read + write)",
    linkToMember: "Link to directory entry",
    noMemberLink: "None",
    sendInvite: "Send invite",
    invited: (email: string, role: string) =>
      `Invited ${email} as ${role}. They can now request a login link with that email.`,
    inviteFailed: "Failed to invite account",
  },
  organizationTree: {
    title: "Organizations",
    empty: "No organizations yet.",
    noMembers: "No members",
  },
  memberMarker: {
    active: "Active",
    lostContactSince: (date: string) => `Lost contact since ${date}`,
  },
  mapControls: {
    filterRange: "Filter Range",
    enable: "Enable",
    disable: "Disable",
    zoomControls: "Zoom Controls",
    mapLayerGroup: "Map Layer Group",
  },
  distanceControl: {
    distanceFrom: "Distance from",
    select: "— Select —",
    myLocation: "My Location",
    gettingLocation: "Getting your location…",
  },
  importExport: {
    exportLabel: "Export Members as CSV",
    importLabel: "Import Members from CSV",
    importResult: (imported: number, total: number, failed: number) =>
      `Imported ${imported} of ${total} members (${failed} failed — likely already existed).`,
  },
};

export type Translations = typeof en;
export default en;
