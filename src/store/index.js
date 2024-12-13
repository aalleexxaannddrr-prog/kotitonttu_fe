import { configureStore } from '@reduxjs/toolkit';
import typesReducer from './slices/typesSlice';
import dataReducer from './slices/dataSlice';
import servicesReducer from './slices/servicesSlice';
import serviceCreationReducer from './slices/serviceCreationSlice';
import authReduser from './slices/authSlice';
import serviceDeletionSlice from './slices/serviceDeletionSlice';
import usersReducer from './slices/usersSlice';
import barcodeTypeReducer from './slices/addBarcodeTypeSlice';
import barcodeDataReducer from './slices/barcodeDataSlice';
import allBarcodeDataReducer from './slices/allBarcodeDataSlice';
import updateBarcodeReducer from './slices/updateBarcodeSlice';
import deleteBarcodeReducer from './slices/deleteBarcodeSlice';
import updateBarcodeTypeReducer from './slices/updateBarcodeTypeSlice';
import deleteBarcodeTypeReducer from './slices/deleteBarcodeTypeSlice';
import errorscodeReducer from './slices/errorscodeSlice';
import approvedBonusDataReducer from './slices/approvedBonusDataSlice';
import pendingBonusDataReducer from './slices/pendingBonusDataSlice';
import rejectedBonusDataReducer from './slices/rejectedBonusDataSlice';
import approvedStatusKotibonusReducer from './slices/approvedStatusKotibonusSlice';
import rejectedStatusKotibonusReducer from './slices/rejectedStatusKotibonusSlice';
import pendingPassVerificationDataReducer from './slices/pendingPassVerificationSlice';
import approvedPassVerificationDataReducer from './slices/approvedPassVerificationDataSlice';
import rejectedPassVerificationReducer from './slices/rejectedPassVerificationData';
import approveVerificationStatusReduser from './slices/approvedVerificationSlice';
import rejectVerificationStatusReducer from './slices/rejectiVerificationSlice';
import sparePartsReducer from './slices/sparePartsSlice';
import updateSparePartByIdReducer from './slices/updateSparePartSlice';
import addSparePartReducer from './slices/addSparePartSlice';
import fetchDialoguesReducer from './slices/dialoguesSlice';
import sendMessageReducer from './slices/messagesSlice';

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
		barcodeTypeData: barcodeDataReducer,
		allBarcodeData: allBarcodeDataReducer,
		updateBarcode: updateBarcodeReducer,
		updateBarcodeType: updateBarcodeTypeReducer,
		deleteBarcode: deleteBarcodeReducer,
		deleteBarcodeType: deleteBarcodeTypeReducer,
		errorscode: errorscodeReducer,
		approvedBonusData: approvedBonusDataReducer,
		pendingBonusData: pendingBonusDataReducer,
		rejectedBonusData: rejectedBonusDataReducer,
		approvedStatusKotibonus: approvedStatusKotibonusReducer,
		rejectedStatusKotibonus: rejectedStatusKotibonusReducer,
		pendingPassVerificationData: pendingPassVerificationDataReducer,
		approvedPassVerificationData: approvedPassVerificationDataReducer,
		rejectedPassVerificationData: rejectedPassVerificationReducer,
		approvedVerification: approveVerificationStatusReduser,
		rejectedVerification: rejectVerificationStatusReducer,
		spareParts: sparePartsReducer,
		updateSparePart: updateSparePartByIdReducer,
		addSparePart: addSparePartReducer,
		dialogues: fetchDialoguesReducer,
		messages: sendMessageReducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: false, // Отключение проверки сериализуемости
			immutableCheck: false, // Отключение проверки неизменяемости
		}),
});
