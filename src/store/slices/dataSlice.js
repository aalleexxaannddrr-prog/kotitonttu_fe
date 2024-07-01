import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
	data: [],
	currentTypes: null,
	status: "",
	error: "",
};

export const fetchProductsByTypes = createAsyncThunk(
	"data/fetchProductsByTypes",
	async () => {
		try {
			const res = await fetch("/types/all-data");
			const text = await res.text();
			// console.log("Full response text: ", text);

			if (!res.ok) {
				throw new Error("Failed to fetch data");
			}

			const json = JSON.parse(text);
			// console.log("Fetched types: ", json);

			// Возвращаем массив данных
			return json.data;
		} catch (err) {
			console.log("Error fetching types:", err.message);
			return Promise.reject(err.message);
		}
	}
);

const dataSlice = createSlice({
	name: "data",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchProductsByTypes.pending, state => {
				state.status = "loading";
			})
			.addCase(fetchProductsByTypes.fulfilled, (state, action) => {
				state.data = action.payload;
				state.status = "ready";
			})
			.addCase(fetchProductsByTypes.rejected, (state, action) => {
				state.status = "error";
				state.error = action.error.message;
			});
	},
});

export default dataSlice.reducer;
