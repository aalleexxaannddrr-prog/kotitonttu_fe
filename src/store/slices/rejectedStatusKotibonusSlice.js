import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Асинхронное действие для отклонения бонусного запроса
export const rejectedStatusKotibonus = createAsyncThunk(
	'rejectedStatusKotibonus/reject',
	async ({ requestId, rejectionMessage, bearerToken }) => {
		const myHeaders = new Headers();
		myHeaders.append('Accept', '*/*');
		myHeaders.append('Authorization', `Bearer ${bearerToken}`);

		const requestOptions = {
			method: 'POST',
			headers: myHeaders,
			redirect: 'follow',
		};

		try {
			const response = await fetch(
				`/bonus-program/updateStatus?requestId=${requestId}&status=REJECTED&rejectionMessage=${rejectionMessage}`,
				requestOptions
			);

			if (!response.ok) {
				throw new Error('Failed to reject bonus request');
			}

			const result = await response.text();
			return result; // Возвращаем результат для последующей обработки в слайсе
		} catch (error) {
			console.error('Ошибка при выполнении запроса:', error);
			throw error;
		}
	}
);

// Начальное состояние
const initialState = {
	status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
	result: null,
	error: null,
};

// Создание слайса
const rejectedStatus = createSlice({
	name: 'rejectedStatusKotibonus',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(rejectedStatusKotibonus.pending, state => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(rejectedStatusKotibonus.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.result = action.payload; // Сохраняем результат выполнения запроса
			})
			.addCase(rejectedStatusKotibonus.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message; // Сохраняем сообщение об ошибке
			});
	},
});

export default rejectedStatus.reducer;
