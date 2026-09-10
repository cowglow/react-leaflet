// Curated data for `pnpm seed:demo`. Replace / extend the entries below with the
// real (partial) roster the demo should open with. Members reference an org by
// its `key` — the key is not stored, it only wires members to orgs here.
//
// `seed:demo` WIPES all organisations and members first, then inserts these.
// Accounts and the audit log are left alone; seed writes bypass the audit log.
//
// To edit: change these arrays, then re-run
//   pnpm --dir server seed:demo                 (local)
//   pnpm backend:seed:demo                      (local, inside the docker api)
//   docker compose -f docker-compose.prod.yml exec -T api pnpm seed:demo   (server)

export type OrgType = "Region" | "Headquarter" | "Area" | "District";
export type DepartmentType = "MD" | "WD" | "JMD" | "JWD";

export interface DemoOrg {
  key: string;
  name: string;
  type: OrgType;
}

export interface DemoMember {
  firstName: string;
  lastName: string;
  /** An org `key` from `demoOrganizations`, or omit for unassigned. */
  org?: string;
  address?: {
    street: string;
    number: string;
    zip: number;
    city: string;
    lat: number;
    lng: number;
  };
  telephone?: string;
  email?: string;
  responsibility?: { level: OrgType; type: DepartmentType };
  /** Defaults to "active". */
  status?: "active" | { lostContactSince: string };
  /** A placeholder pin dropped on the map, no real details yet (amber marker). */
  incomplete?: boolean;
  /** ISO date; defaults to now. */
  signupDate?: string;
  /** Link the SEED_LEADER_EMAIL account to this member. Use on at most one. */
  linkToLeaderAccount?: boolean;
}

// A small starter structure around Nuremberg — enough to show the tree and dot
// the map. Extend with the real orgs before the demo.
export const demoOrganizations: DemoOrg[] = [
  { key: "region", name: "Middle Franconia Region", type: "Region" },
  { key: "hq", name: "Nuremberg Headquarter", type: "Headquarter" },
  { key: "area-north", name: "Nuremberg North Area", type: "Area" },
  { key: "area-south", name: "Nuremberg South Area", type: "Area" },
  { key: "area-fue", name: "Fürth-Erlangen Area", type: "Area" },
  { key: "dist-altstadt", name: "Altstadt District", type: "District" },
  { key: "dist-suedstadt", name: "Südstadt District", type: "District" },
  { key: "dist-fuerth", name: "Fürth District", type: "District" },
];

export const demoMembers: DemoMember[] = [
  {
    firstName: "Martin",
    lastName: "Brandt",
    org: "dist-altstadt",
    address: { street: "Hauptmarkt", number: "18", zip: 90403, city: "Nürnberg", lat: 49.4542, lng: 11.0774 },
    telephone: "+49 911 2010001",
    email: "martin.brandt@example.org",
    responsibility: { level: "District", type: "MD" },
    signupDate: "2019-03-12",
    linkToLeaderAccount: true,
  },
  {
    firstName: "Petra",
    lastName: "Hoffmann",
    org: "dist-altstadt",
    address: { street: "Königstraße", number: "74", zip: 90402, city: "Nürnberg", lat: 49.4498, lng: 11.0801 },
    telephone: "+49 911 2010002",
    email: "petra.hoffmann@example.org",
    responsibility: { level: "District", type: "WD" },
    signupDate: "2020-06-01",
  },
  {
    firstName: "Tobias",
    lastName: "Krause",
    org: "dist-altstadt",
    address: { street: "Weißgerbergasse", number: "9", zip: 90403, city: "Nürnberg", lat: 49.4571, lng: 11.0723 },
    telephone: "+49 911 2010003",
    email: "tobias.krause@example.org",
    signupDate: "2021-01-20",
  },
  {
    firstName: "Sabine",
    lastName: "Vogel",
    org: "dist-suedstadt",
    address: { street: "Aufseßplatz", number: "4", zip: 90459, city: "Nürnberg", lat: 49.4373, lng: 11.0812 },
    telephone: "+49 911 2010004",
    email: "sabine.vogel@example.org",
    responsibility: { level: "District", type: "MD" },
    signupDate: "2019-09-05",
  },
  {
    firstName: "Jonas",
    lastName: "Fischer",
    org: "dist-suedstadt",
    address: { street: "Wölckernstraße", number: "23", zip: 90459, city: "Nürnberg", lat: 49.4409, lng: 11.0865 },
    telephone: "+49 911 2010005",
    email: "jonas.fischer@example.org",
    status: { lostContactSince: "2024-11-01" },
    signupDate: "2022-04-18",
  },
  {
    firstName: "Lena",
    lastName: "Wagner",
    org: "dist-suedstadt",
    address: { street: "Siebenkeesstraße", number: "12", zip: 90459, city: "Nürnberg", lat: 49.4356, lng: 11.0759 },
    telephone: "+49 911 2010006",
    email: "lena.wagner@example.org",
    responsibility: { level: "District", type: "JWD" },
    signupDate: "2023-02-11",
  },
  {
    firstName: "Andreas",
    lastName: "Schulz",
    org: "dist-fuerth",
    address: { street: "Rathausplatz", number: "1", zip: 90762, city: "Fürth", lat: 49.4776, lng: 10.9897 },
    telephone: "+49 911 2010007",
    email: "andreas.schulz@example.org",
    responsibility: { level: "District", type: "MD" },
    signupDate: "2020-11-30",
  },
  {
    firstName: "Nadine",
    lastName: "Böhm",
    org: "dist-fuerth",
    address: { street: "Schwabacher Straße", number: "56", zip: 90762, city: "Fürth", lat: 49.4732, lng: 10.9908 },
    telephone: "+49 911 2010008",
    email: "nadine.boehm@example.org",
    signupDate: "2021-07-07",
  },
  {
    firstName: "Christoph",
    lastName: "Neumann",
    org: "area-north",
    address: { street: "Bucher Straße", number: "140", zip: 90419, city: "Nürnberg", lat: 49.4711, lng: 11.0741 },
    telephone: "+49 911 2010009",
    email: "christoph.neumann@example.org",
    responsibility: { level: "Area", type: "MD" },
    signupDate: "2018-05-14",
  },
  {
    firstName: "Julia",
    lastName: "Kaiser",
    org: "area-south",
    address: { street: "Frankenstraße", number: "150", zip: 90461, city: "Nürnberg", lat: 49.4321, lng: 11.0915 },
    telephone: "+49 911 2010010",
    email: "julia.kaiser@example.org",
    responsibility: { level: "Area", type: "WD" },
    signupDate: "2019-12-02",
  },
  {
    firstName: "Michael",
    lastName: "Roth",
    org: "area-fue",
    address: { street: "Hugenottenplatz", number: "3", zip: 91054, city: "Erlangen", lat: 49.5981, lng: 11.0039 },
    telephone: "+49 9131 201011",
    email: "michael.roth@example.org",
    responsibility: { level: "Area", type: "MD" },
    signupDate: "2020-02-25",
  },
  {
    firstName: "Katrin",
    lastName: "Baumann",
    org: "hq",
    address: { street: "Bahnhofsplatz", number: "9", zip: 90443, city: "Nürnberg", lat: 49.4456, lng: 11.0824 },
    telephone: "+49 911 2010012",
    email: "katrin.baumann@example.org",
    responsibility: { level: "Headquarter", type: "WD" },
    signupDate: "2017-08-19",
  },
  {
    // Unassigned — no org yet.
    firstName: "Daniel",
    lastName: "Frank",
    address: { street: "Gostenhofer Hauptstraße", number: "44", zip: 90443, city: "Nürnberg", lat: 49.4508, lng: 11.0559 },
    telephone: "+49 911 2010013",
    email: "daniel.frank@example.org",
    signupDate: "2024-03-01",
  },
  {
    // Placeholder pin — Shift+click style, details to be filled in.
    firstName: "",
    lastName: "",
    address: { street: "", number: "", zip: 0, city: "", lat: 49.3294, lng: 11.0213 },
    incomplete: true,
  },
];
