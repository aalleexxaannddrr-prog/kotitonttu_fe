import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
	services: [],
	currentTypes: null,
	status: "",
	error: '',
};

export const fetchServiceCentres = createAsyncThunk(
	"services/fetchServiceCentres",
	async (_, { rejectWithValue }) => {
		try {
			const response = await fetch('/service-centers/get-all-service-centers');
			if (!response.ok) {
				throw new Error("Failed to fetch data");
			}
			const data = await response.json(); // Предполагаем, что данные возвращаются в виде массива
			return data; // Возвращаем полученные данные
		} catch (error) {
			return rejectWithValue(error.message); // Обработка ошибки
		}
	}
);

// const servicesSlice = createSlice({
// 	name: "services",
// 	initialState,
// 	reducers: {},
// 	extraReducers: builder => {
// 		builder
// 			.addCase(fetchServiceCentres.pending, state => {
// 				state.status = "loading";
// 			})
// 			.addCase(fetchServiceCentres.fulfilled, (state, action) => {
// 				state.services = action.payload; // Сохраняем данные в state.services
// 				state.status = "ready";
// 			})
// 			.addCase(fetchServiceCentres.rejected, (state, action) => {
// 				state.status = "error";
// 				state.error = action.error.message;
// 			});
// 	},
// });

const servicesSlice = createSlice({
	name: "services",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchServiceCentres.pending, state => {
				state.status = "loading"; // Устанавливаем статус в loading
			})
			.addCase(fetchServiceCentres.fulfilled, (state, action) => {
				state.services = action.payload; // Сохраняем данные в state.services
				state.status = "ready"; // Устанавливаем статус в ready
			})
			.addCase(fetchServiceCentres.rejected, (state, action) => {
				state.status = "error"; // Устанавливаем статус в error
				state.error = action.payload || action.error.message; // Устанавливаем сообщение об ошибке
			});
	},
});

export default servicesSlice.reducer;
