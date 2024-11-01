import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Начальное состояние
const initialState = {
	data: [],
	status: 'idle', // 'idle' | 'loading' | 'ready' | 'error'
	error: null,
};

// Асинхронное действие для получения всех отклоненных бонусных заявок
export const fetchRejectedBonusRequests = createAsyncThunk(
	'rejectedBonusData/fetchRejectedBonusRequests',
	async () => {
		const requestOptions = {
			method: 'GET',
			redirect: 'follow',
		};

		try {
			const response = await fetch(
				'/bonus-program/get-all-bonus-requests-by-parameter?requestStatus=REJECTED',
				requestOptions
			);

			if (!response.ok) {
				throw new Error('Failed to fetch rejected bonus requests');
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
const rejectedBonusDataSlice = createSlice({
	name: 'rejectedBonusData',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchRejectedBonusRequests.pending, state => {
				state.status = 'loading';
			})
			.addCase(fetchRejectedBonusRequests.fulfilled, (state, action) => {
				// Сохраняем данные в стейт после успешного запроса
				state.data = action.payload.map(user => ({
					email: user.email,
					bonusRequests: user.bonusRequests.map(request => ({
						id: request.bonusRequestId,
						requestDate: request.requestDate,
						responseDate: request.responseDate,
						status: request.status,
						rejectionMessage: request.rejectionMessage,
						photos: request.photos,
					})),
				}));
				state.status = 'ready';
			})
			.addCase(fetchRejectedBonusRequests.rejected, (state, action) => {
				state.status = 'error';
				state.error = action.error.message;
			});
	},
});

export default rejectedBonusDataSlice.reducer;
