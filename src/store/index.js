import { configureStore } from "@reduxjs/toolkit";
import typesReducer from "./slices/typesSlice";
import dataReducer from "./slices/dataSlice";
import servicesReducer from "./slices/servicesSlice";

export const store = configureStore({
	reducer: {
		types: typesReducer,
		data: dataReducer,
		services: servicesReducer,
	},
});
