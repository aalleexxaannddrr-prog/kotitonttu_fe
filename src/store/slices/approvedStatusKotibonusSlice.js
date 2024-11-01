import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Асинхронное действие для одобрения бонусного запроса
export const approvedStatusKotibonus = createAsyncThunk(
	'approvedStatusKotibonus/approve',
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
				`/bonus-program/updateStatus?requestId=${requestId}&status=APPROVED&rejectionMessage=${rejectionMessage}`,
				requestOptions
			);

			if (!response.ok) {
				throw new Error('Failed to approve bonus request');
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
const approvedStatus = createSlice({
	name: 'approvedStatusKotibonus',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(approvedStatusKotibonus.pending, state => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(approvedStatusKotibonus.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.result = action.payload; // Сохраняем результат выполнения запроса
			})
			.addCase(approvedStatusKotibonus.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message; // Сохраняем сообщение об ошибке
			});
	},
});

export default approvedStatus.reducer;
