import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Асинхронное действие для отклонения верификации
export const rejectVerificationStatus = createAsyncThunk(
	'rejectedVerification/reject',
	async ({ documentVerificationId, rejectionMessage, bearerToken }) => {
		if (!bearerToken) {
			throw new Error('Bearer token is missing');
		}

		const myHeaders = new Headers();
		myHeaders.append('Accept', '*/*');
		myHeaders.append('Authorization', `Bearer ${bearerToken}`);

		const url = `/bonus-program/updateDocumentVerificationStatus?documentVerificationId=${documentVerificationId}&status=REJECTED&rejectionMessage=${encodeURIComponent(
			rejectionMessage
		)}`;

		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: myHeaders,
				credentials: 'include', // Включаем отправку куков
				redirect: 'follow',
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error('Ошибка в ответе:', errorText);
				throw new Error(errorText || 'Failed to reject document verification');
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
const rejectedVerificationSlice = createSlice({
	name: 'rejectedVerification',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(rejectVerificationStatus.pending, state => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(rejectVerificationStatus.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.result = action.payload; // Сохраняем результат выполнения запроса
			})
			.addCase(rejectVerificationStatus.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message; // Сохраняем сообщение об ошибке
			});
	},
});

export default rejectedVerificationSlice.reducer;
