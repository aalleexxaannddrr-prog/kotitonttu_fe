import { configureStore } from "@reduxjs/toolkit";
import typesReducer from "./slices/typesSlice";
import dataReducer from "./slices/dataSlice";
import servicesReducer from "./slices/servicesSlice";
import serviceCreationReducer from "./slices/serviceCreationSlice";
import authReduser from "./slices/authSlice";

export const store = configureStore({
	reducer: {
		types: typesReducer,
		data: dataReducer,
		services: servicesReducer,
		serviceCreation: serviceCreationReducer,
		auth: authReduser,
	},
});
