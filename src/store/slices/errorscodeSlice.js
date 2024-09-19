import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Создаем async thunk для фетч-запроса
export const fetchErrorscode = createAsyncThunk(
	'categories/fetchCategories',
	async (_, { rejectWithValue }) => {
		const requestOptions = {
			method: 'GET',
			redirect: 'follow',
		};

		try {
			const response = await fetch(
				'/passport/categories',
				requestOptions
			);
			if (!response.ok) {
				throw new Error('Ошибка сети');
			}
			const data = await response.text();
			return data;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

const errorscodeSlice = createSlice({
	name: 'errorscode',
	initialState: {
		data: null,
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchErrorscode.pending, state => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchErrorscode.fulfilled, (state, action) => {
				state.loading = false;
				state.data = action.payload;
			})
			.addCase(fetchErrorscode.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export default errorscodeSlice.reducer;
