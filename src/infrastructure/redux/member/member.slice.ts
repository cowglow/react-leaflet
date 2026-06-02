export const CREATE_MEMBER = "CREATE_MEMBER";
export const READ_MEMBER = "READ_MEMBER";
export const UPDATE_MEMBER = "UPDATE_MEMBER";
export const DELETE_MEMBER = "DELETE_MEMBER";

export const createMemberAction = (payload) => ({ type: CREATE_MEMBER, payload });
export const readMemberAction = (payload) => ({ type: READ_MEMBER, payload });
export const updateMemberAction = (payload) => ({ type: UPDATE_MEMBER, payload });
export const deleteMemberAction = (payload) => ({ type: DELETE_MEMBER, payload });

const initialState = { members: [] };

export const memberReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_MEMBER:
      return { ...state, members: [...state.members, action.payload] };
    default:
      return state;
  }
};