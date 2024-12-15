import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const apiUrl = '/boiler/find-all';

// Thunk для получения данных с сервера
export const fetchBoilers = createAsyncThunk(
	'boilers/fetchBoilers',
	async (bearerToken, { rejectWithValue }) => {
		try {
			const response = await fetch(apiUrl, {
				method: 'GET',
				headers: {
					Accept: '*/*',
					Authorization: `Bearer ${bearerToken}`,
				},
			});

			if (!response.ok) {
				throw new Error('Failed to fetch boiler data');
			}

			const data = await response.json(); // Парсим JSON-ответ
			return data;
		} catch (error) {
			console.error('Error fetching boiler data:', error);
			return rejectWithValue(error.message);
		}
	}
);

// Slice для управления состоянием данных
const boilersSlice = createSlice({
	name: 'boilers',
	initialState: {
		boilers: [], // Данные из сервера
		status: 'idle', // idle | loading | succeeded | failed
		error: null, // Ошибка при загрузке
	},
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchBoilers.pending, state => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(fetchBoilers.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.boilers = action.payload; // Сохраняем полученные данные
			})
			.addCase(fetchBoilers.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload; // Сохраняем сообщение об ошибке
			});
	},
});

// Экспортируем thunk и reducer
export default boilersSlice.reducer;
