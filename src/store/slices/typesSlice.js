import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
	types: [],
	currentTypes: null,
	status: "",
	error: "",
};

// export const fetchAllTypes = createAsyncThunk(
// 	"types/fetchAllTypes",
// 	async () => {
// 		try {
// 			const res = await fetch("/types/all");

// 			// Логирование полного ответа
// 			const text = await res.text();
// 			// console.log("Full response text:", text);

// 			if (!res.ok) {
// 				throw new Error("Failed to fetch types!");
// 			}
// 			const json = JSON.parse(text); // Парсим текст как JSON
// 			// console.log("Fetched types:", json);
// 			// Возвращаем массив данных
// 			return json.data;
// 		} catch (err) {
// 			// console.log("Error fetching types:", err.message);
// 			return Promise.reject(err.message);
// 		}
// 	}
// );

export const fetchAllTypes = createAsyncThunk(
	"types/fetchAllTypes",
	async () => {
		try {
			const res = await fetch("/types/all");
			if (!res.ok) {
				const errorBody = await res.text(); // или res.json() если сервер возвращает JSON
				throw new Error(`Failed to fetch types: ${res.status} ${errorBody}`);
			}
			const json = await res.json();
			return json.data;

		} catch (err) {
			console.error("Error fetching types:", err);
			return Promise.reject(err.message);
		}
	}
);

// const typesSlice = createSlice({
// 	name: "types",
// 	initialState,
// 	reducers: {},
// 	extraReducers: builder => {
// 		builder
// 			.addCase(fetchAllTypes.pending, state => {
// 				state.status = "loading";
// 			})
// 			.addCase(fetchAllTypes.fulfilled, (state, action) => {
// 				state.types = action.payload;
// 				state.status = "ready";
// 			})
// 			.addCase(fetchAllTypes.rejected, (state, action) => {
// 				state.status = "error";
// 				state.error = action.error.message;
// 			});
// 	},
// });

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
