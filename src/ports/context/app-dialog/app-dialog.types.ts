import type { GeoCoordinate } from "domain/marker/geo-coordinate.ts";

export type DialogType = "MEMBER_DIALOG" | "ORGANIZATION_DIALOG";

export type DialogPayload = {
  coordinates?: GeoCoordinate;
  memberId?: string;
};

export type DialogContextApi = {
  dialog: DialogType | null;
  payload: DialogPayload | null;
  openDialog: (dialog: DialogType | null, payload?: DialogPayload | null) => void;
};
