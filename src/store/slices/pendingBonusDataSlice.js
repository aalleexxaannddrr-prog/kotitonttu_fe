import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
	data: [],
	status: 'idle', // 'idle' | 'loading' | 'ready' | 'error'
	error: null,
};

export const fetchPendingBonusRequests = createAsyncThunk(
	'pendingBonusData/fetchPendingBonusRequests',
	async () => {
		const requestOptions = {
			method: 'GET',
			redirect: 'follow',
		};

		try {
			const response = await fetch(
				'/bonus-program/get-all-bonus-requests-by-parameter?requestStatus=PENDING',
				requestOptions
			);

			if (!response.ok) {
				throw new Error('Failed to fetch pending bonus requests');
			}

			const text = await response.text(); // Получаем текстовый ответ
			const json = JSON.parse(text); // Парсим текст в JSON

			return json; // Возвращаем полученные данные
		} catch (err) {
			console.error('Ошибка при запросе:', err); // Логируем ошибки запроса
			return Promise.reject(err.message);
		}
	}
);

// Создание слайса
const pendingBonusDataSlice = createSlice({
	name: 'pendingBonusData',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchPendingBonusRequests.pending, state => {
				state.status = 'loading';
			})
			.addCase(fetchPendingBonusRequests.fulfilled, (state, action) => {
				state.data = action.payload.map(user => ({
					email: user.email,
					bonusRequests: user.bonusRequests,
				}));
				state.status = 'ready';
			})
			.addCase(fetchPendingBonusRequests.rejected, (state, action) => {
				state.status = 'error';
				state.error = action.error.message;
			});
	},
});

export default pendingBonusDataSlice.reducer;
