import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
	types: [],
	currentTypes: null,
	status: "",
	error: "",
};

export const fetchAllTypes = createAsyncThunk(
	"types/fetchAllTypes",
	async () => {
		try {
			const res = await fetch("/types/all");
			if (!res.ok) {
				throw new Error("Failed to fetch types!");
			}
			const json = await res.json();
			return json.data; // Возвращаем массив, который находится внутри поля `data`
		} catch (err) {
			return Promise.reject(err.message);
		}
	}
);

const typesSlice = createSlice({
	name: "types",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchAllTypes.pending, state => {
				state.status = "loading";
			})
			.addCase(fetchAllTypes.fulfilled, (state, action) => {
				state.types = action.payload; // Убедитесь, что action.payload это массив
				state.status = "ready";
			})
			.addCase(fetchAllTypes.rejected, (state, action) => {
				state.status = "error";
				state.error = action.error.message;
			});
	},
});

export default typesSlice.reducer;
