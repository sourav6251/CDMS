// src/redux/reduxSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface userState {
    isLogin: boolean;
    // userID:String,
    userEmail: string;
    userName:string;
    darkMode: boolean;
    role: string;
    profilePic: string; 
}

const initialState: userState = {
    isLogin: false,
    userEmail: "String",
    darkMode: false,
    userName:"Hello user",
    role: "user",
    profilePic: "https://ik.imagekit.io/eur1zq65p/jwt-hero.png",
};

const reduxSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<userState>) => {
            state.isLogin = true;
            state.role = action.payload.role;
            state.userEmail = action.payload.userEmail;
            state.userName=action.payload.userName;
            state.profilePic = action.payload.profilePic;
        },
        toggleDarkmode: (state, action: PayloadAction<boolean>) => {
            state.darkMode = action.payload;
        },
        logout: (state) => {
            state.isLogin = false;
            state.role = "user";
            state.userEmail = "";
            state.userName="Hello user";
            state.profilePic = "https://ik.imagekit.io/eur1zq65p/jwt-hero.png";
        },
    },
});

export const { login, toggleDarkmode, logout } = reduxSlice.actions;
export default reduxSlice.reducer;
