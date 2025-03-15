// CREATE
import {
  CREATE_MARKER,
  DELETE_MARKER,
  READ_MARKER,
  UPDATE_MARKER,
} from "./marker-action-types.ts";
// CREATE
export const createMarkerAction = (payload) => ({
  type: CREATE_MARKER,
  payload,
});
// READ
export const readMarkerAction = (payload) => ({
  type: READ_MARKER,
  payload,
});
// UPDATE
export const updateMarkerAction = (payload) => ({
  type: UPDATE_MARKER,
  payload,
});
// DELETE
export const deleteMarkerAction = (payload) => ({
  type: DELETE_MARKER,
  payload,
});
