import { CREATE_MEMBER } from "./member-action-types.ts";

const initialState = {
  members: [],
};
export const memberReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_MEMBER:
      return {
        ...state,
        members: [...state.members, action.payload],
      };
    default:
      return state;
  }
};
