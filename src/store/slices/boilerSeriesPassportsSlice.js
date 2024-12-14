import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Асинхронное действие для получения данных
export const fetchBoilerSeriesPassports = createAsyncThunk(
	'boilerSeriesPassports/fetchAll',
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
			const response = await fetch(
				'/boiler-series-passport/get-all',
				requestOptions
			);

			if (!response.ok) {
				throw new Error('Failed to fetch boiler series passports');
			}

			const data = await response.json(); // Предполагается, что сервер возвращает JSON
			return data;
		} catch (error) {
			console.error('Error fetching boiler series passports:', error);
			return rejectWithValue(error.message);
		}
	}
);

// Slice
const boilerSeriesPassportsSlice = createSlice({
	name: 'boilerSeriesPassports',
	initialState: {
		data: [], // Данные из API
		status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
		error: null, // Ошибки
	},
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchBoilerSeriesPassports.pending, state => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(fetchBoilerSeriesPassports.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.data = action.payload;
			})
			.addCase(fetchBoilerSeriesPassports.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			});
	},
});

export default boilerSeriesPassportsSlice.reducer;
