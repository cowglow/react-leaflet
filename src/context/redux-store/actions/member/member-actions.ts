// CREATE
import {
  CREATE_MEMBER,
  DELETE_MEMBER,
  READ_MEMBER,
  UPDATE_MEMBER,
} from "./member-action-types.ts";

export const createMemberAction = (payload) => ({
  type: CREATE_MEMBER,
  payload,
});
// READ
export const readMemberAction = (payload) => ({
  type: READ_MEMBER,
  payload,
});
// UPDATE
export const updateMemberAction = (payload) => ({
  type: UPDATE_MEMBER,
  payload,
});
// DELETE
export const deleteMemberAction = (payload) => ({
  type: DELETE_MEMBER,
  payload,
});
