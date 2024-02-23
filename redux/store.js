import { configureStore } from "@reduxjs/toolkit";
import todosReducer from './todosSlice';
import profileReducer from "./profileSlice";

export const store = configureStore({
    reducer:{
        todos: todosReducer,
        profile: profileReducer,
    }
})