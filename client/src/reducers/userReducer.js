import { GET_POPULAR_USERS } from "../actions/types";

const initialState = {
  popularUsers: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_POPULAR_USERS:
      return {
        ...state,
        popularUsers: action.payload
      };
    default:
      return state;
  }
}
