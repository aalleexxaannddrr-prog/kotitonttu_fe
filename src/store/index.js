import { configureStore } from "@reduxjs/toolkit";
import typesReducer from "./slices/typesSlice";
import dataReducer from "./slices/dataSlice";
import servicesReducer from "./slices/servicesSlice";
import serviceCreationReducer from "./slices/serviceCreationSlice";

export const store = configureStore({
	reducer: {
		types: typesReducer,
		data: dataReducer,
		services: servicesReducer,
		serviceCreation: serviceCreationReducer,
	},
});
