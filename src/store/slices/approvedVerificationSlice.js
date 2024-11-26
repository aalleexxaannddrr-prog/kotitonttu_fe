import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Асинхронное действие для одобрения верификации
export const approveVerificationStatus = createAsyncThunk(
	'verificationStatus/approve',
	async ({ documentVerificationId, rejectionMessage, bearerToken }) => {
		if (!bearerToken) {
			throw new Error('Bearer token is missing');
		}

		const myHeaders = new Headers();
		myHeaders.append('Accept', '*/*');
		myHeaders.append('Authorization', `Bearer ${bearerToken}`);

		const url = `/bonus-program/updateDocumentVerificationStatus?documentVerificationId=${documentVerificationId}&status=APPROVED&rejectionMessage=${encodeURIComponent(
			rejectionMessage || ''
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
				throw new Error(errorText || 'Failed to approve document verification');
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
const approvedVerificationSlice = createSlice({
	name: 'approvedVerification',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(approveVerificationStatus.pending, state => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(approveVerificationStatus.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.result = action.payload; // Сохраняем результат выполнения запроса
			})
			.addCase(approveVerificationStatus.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message; // Сохраняем сообщение об ошибке
			});
	},
});

export default approvedVerificationSlice.reducer;
