import type { Translations } from "ports/i18n/translations/en.ts";

const de: Translations = {
  common: {
    save: "Speichern",
    cancel: "Abbrechen",
    close: "Schließen",
    resize: "Größe ändern",
    edit: "Bearbeiten",
    remove: "Entfernen",
    delete: "Löschen",
    retry: "Erneut versuchen",
  },
  organizationTypes: {
    Region: "Region",
    Headquarter: "Hauptstelle",
    Area: "Bereich",
    District: "Bezirk",
  },
  mapWindow: {
    title: "Karte",
  },
  menu: {
    file: "Datei",
    actions: "Aktionen",
    about: "Über",
    language: "Sprache",
    import: "Importieren",
    exportCsv: "Als CSV exportieren",
    exportGeoJson: "Als GeoJSON exportieren",
    addOrganization: "Organisation hinzufügen",
    inviteAccount: "Konto einladen",
    organizations: "Organisationen",
    systemCss: "system.css",
    sakunsTwitter: "sakuns Twitter",
    githubRepo: "GitHub-Repo",
    map: "Karte",
  },
  auth: {
    signIn: "Anmelden",
    email: "E-Mail",
    sendLoginLink: "Login-Link senden",
    linkSent:
      "Falls zu dieser E-Mail ein Konto existiert, wurde ein Login-Link gesendet. Prüfen Sie Ihren Posteingang (oder die Serverkonsole in der Entwicklungsumgebung).",
    genericError: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
    loading: "Lädt…",
    cantConnect: "Verbindung fehlgeschlagen",
  },
  connectionError: (message: string) =>
    `Daten konnten nicht geladen werden: ${message}`,
  connectionErrorBanner: {
    retry: "Erneut versuchen",
  },
  memberForm: {
    addTitle: "Mitglied hinzufügen",
    editTitle: "Mitglied bearbeiten",
    noLocation:
      "Kein Standort ausgewählt. Schließen Sie dies und klicken Sie auf die Karte, um ein neues Mitglied zu platzieren.",
    firstName: "Vorname",
    lastName: "Nachname",
    street: "Straße",
    number: "Nr.",
    zip: "PLZ",
    city: "Stadt",
    telephone: "Telefon",
    email: "E-Mail",
    organization: "Organisation",
    unassigned: "— Nicht zugewiesen —",
    lostContact: "Kontakt verloren",
    lastKnownActive: "Zuletzt aktiv",
    saveFailed: "Mitglied konnte nicht gespeichert werden",
    removeFailed: "Mitglied konnte nicht entfernt werden",
    confirmRemoveTitle: "Mitglied entfernen?",
    confirmRemoveMessage: (name: string) =>
      `${name} entfernen? Dies kann nicht rückgängig gemacht werden.`,
  },
  organizationForm: {
    title: "Organisation hinzufügen",
    name: "Name",
    type: "Typ",
    saveFailed: "Organisation konnte nicht gespeichert werden",
  },
  inviteForm: {
    title: "Konto einladen",
    email: "E-Mail",
    role: "Rolle",
    roleMember: "Mitglied (nur Lesen)",
    roleLeader: "Leiter (Lesen + Schreiben)",
    linkToMember: "Mit Verzeichniseintrag verknüpfen",
    noMemberLink: "Keiner",
    sendInvite: "Einladung senden",
    invited: (email: string, role: string) =>
      `${email} als ${role} eingeladen. Die Person kann nun mit dieser E-Mail einen Login-Link anfordern.`,
    inviteFailed: "Einladung konnte nicht gesendet werden",
  },
  organizationTree: {
    title: "Organisationen",
    empty: "Noch keine Organisationen.",
    noMembers: "Keine Mitglieder",
  },
  memberMarker: {
    active: "Aktiv",
    lostContactSince: (date: string) => `Kontakt verloren seit ${date}`,
  },
  importExport: {
    importResult: (imported: number, total: number, failed: number) =>
      `${imported} von ${total} Mitgliedern importiert (${failed} fehlgeschlagen — vermutlich bereits vorhanden).`,
  },
};

export default de;
