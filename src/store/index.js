import { configureStore } from "@reduxjs/toolkit";
import typesReducer from "./slices/typesSlice";
import dataReducer from "./slices/dataSlice";

export const store = configureStore({
	reducer: {
		types: typesReducer,
		data: dataReducer,
	},
});
