const initialState = {};

const LoginReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        data: action.payload
      };
    default:
      return state;
  }
};

export default LoginReducer