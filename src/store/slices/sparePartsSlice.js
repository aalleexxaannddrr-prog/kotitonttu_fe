import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Асинхронное действие для получения всех запасных частей
export const fetchSpareParts = createAsyncThunk(
	'spareParts/fetchSpareParts',
	async ({ bearerToken }, { rejectWithValue }) => {
		const myHeaders = new Headers();
		myHeaders.append('Accept', '*/*');
		myHeaders.append('Authorization', `Bearer ${bearerToken}`);

		const requestOptions = {
			method: 'GET',
			headers: myHeaders,
			redirect: 'follow',
		};

		try {
			const response = await fetch('/spare-part/get-all', requestOptions);

			if (!response.ok) {
				throw new Error('Failed to fetch spare parts');
			}

			const result = await response.json(); // Ожидаем, что результат возвращается в формате JSON
			return result;
		} catch (error) {
			console.error('Error:', error);
			return rejectWithValue(error.message); // Возвращаем ошибку
		}
	}
);

const sparePartsSlice = createSlice({
	name: 'spareParts',
	initialState: {
		data: [],
		status: null,
		error: null,
	},
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchSpareParts.pending, state => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(fetchSpareParts.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.data = action.payload;
			})
			.addCase(fetchSpareParts.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			});
	},
});

export default sparePartsSlice.reducer;
