import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Асинхронное действие для одобрения бонусного запроса
export const approvedStatusKotibonus = createAsyncThunk(
	'approvedStatusKotibonus/approve',
	async ({ requestId, rejectionMessage, bearerToken }) => {
		if (!bearerToken) {
			throw new Error('Bearer token is missing');
		}

		const myHeaders = new Headers();
		myHeaders.append('Accept', '*/*');
		myHeaders.append('Authorization', `Bearer ${bearerToken}`);

		const url = `/bonus-program/updateStatus?requestId=${requestId}&status=APPROVED&rejectionMessage=${encodeURIComponent(
			rejectionMessage || ''
		)}`;

		// console.log('Bearer Token в approvedStatusKotibonus:', bearerToken);
		// console.log('URL:', url);

		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: myHeaders,
				credentials: 'include', // Включаем отправку куков
				redirect: 'follow',
			});

			// console.log('Response status:', response.status);

			if (!response.ok) {
				const errorText = await response.text();
				console.error('Ошибка в ответе:', errorText);
				throw new Error(errorText || 'Failed to approve bonus request');
			}

			const result = await response.text();
			return result;
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
