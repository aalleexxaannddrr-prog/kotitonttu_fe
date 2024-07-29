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
			const response = await fetch("/service-centres/getAll");
			if (!response.ok) {
				throw new Error("Failed to fetch data");
			}
			const data = await response.json();
			return data; // Непосредственно возвращаем полученные данные
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

const servicesSlice = createSlice({
	name: "services",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchServiceCentres.pending, state => {
				state.status = "loading";
			})
			.addCase(fetchServiceCentres.fulfilled, (state, action) => {
				state.services = action.payload; // Сохраняем данные в state.services
				state.status = "ready";
			})
			.addCase(fetchServiceCentres.rejected, (state, action) => {
				state.status = "error";
				state.error = action.error.message;
			});
	},
});

export default servicesSlice.reducer;
