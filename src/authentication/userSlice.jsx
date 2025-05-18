import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  isAdmin: false,
  user: {},
  userId: "",
  signupUser: {},
  userLanguageSTT: "ar-JO",
};

const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: {
      prepare(newUser, token, conversations) {
        return {
          payload: {
            user: newUser,
            token,
            questions: conversations || [],
          },
        };
      },
      reducer(state, action) {
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem(
          "questions",
          JSON.stringify(action.payload.questions)
        );
        localStorage.setItem("isAuthenticated", true);
        state.isAuthenticated = true;
        state.isAdmin =
          action.payload.user.appUserRole === "ADMIN" ? true : false;
        state.user = action.payload.user;
        state.userId = action.payload.user.userId;
        state.signupUser = {};
      },
    },
    logout(state) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("questions");
      localStorage.removeItem("isAuthenticated");
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.user = {};
      state.signupUser = {};
    },
    setSignupUser(state, action) {
      console.log(action.payload);
      state.signupUser = action.payload;
    },
    changeUserLanguageSTT(state, action) {
      state.userLanguageSTT = action.payload;
    },
  },
});

export const { login, logout, setSignupUser, changeUserLanguageSTT } =
  userReducer.actions;
export default userReducer.reducer;
