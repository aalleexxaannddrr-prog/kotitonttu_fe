import { configureStore } from "@reduxjs/toolkit";
import typesReducer from "./slices/typesSlice";
import dataReducer from "./slices/dataSlice";
import servicesReducer from "./slices/servicesSlice";
import serviceCreationReducer from "./slices/serviceCreationSlice";
import authReduser from "./slices/authSlice";
import serviceDeletionSlice from "./slices/serviceDeletionSlice";
import usersReducer from './slices/usersSlice';
import barcodeTypeReducer from './slices/barcodeTypeSlice';
import barcodeDataReducer from './slices/barcodeDataSlice';

export const store = configureStore({
	reducer: {
		types: typesReducer,
		data: dataReducer,
		services: servicesReducer,
		serviceCreation: serviceCreationReducer,
		serviceDeletionSlice: serviceDeletionSlice,
		auth: authReduser,
		users: usersReducer,
		barcodeTypes: barcodeTypeReducer,
		barcodeData: barcodeDataReducer,
	},
});
