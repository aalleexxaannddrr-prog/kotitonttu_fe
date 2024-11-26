import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Начальное состояние
const initialState = {
	data: [],
	status: 'idle', // 'idle' | 'loading' | 'ready' | 'error'
	error: null,
};

// Асинхронное действие для получения отклоненных данных верификации
export const fetchRejectedPassVerificationData = createAsyncThunk(
	'rejectedPassVerificationData/fetchRejectedPassVerificationData',
	async (_, { getState, rejectWithValue }) => {
		const state = getState();
		const bearerToken = state.auth?.bearerToken; // Токен хранится в auth
		if (!bearerToken) {
			return rejectWithValue('Bearer token отсутствует');
		}

		const requestOptions = {
			method: 'GET',
			headers: {
				Accept: '*/*',
				Authorization: `Bearer ${bearerToken}`,
			},
			redirect: 'follow',
		};

		try {
			const response = await fetch(
				'http://31.129.102.70:8080/bonus-program/get-all-document-verifications-request-by-parameter?requestStatus=REJECTED',
				requestOptions
			);

			if (!response.ok) {
				throw new Error(
					`Ошибка запроса: ${response.status} ${response.statusText}`
				);
			}

			const result = await response.json();
			return result;
		} catch (error) {
			console.error('Ошибка при получении данных:', error);
			return rejectWithValue(error.message);
		}
	}
);

// Создание слайса
const rejectedPassVerificationSlice = createSlice({
	name: 'rejectedPassVerificationData',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchRejectedPassVerificationData.pending, state => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(fetchRejectedPassVerificationData.fulfilled, (state, action) => {
				state.data = action.payload.map(verification => ({
					requestId: verification.requestId,
					requestDate: verification.requestDate,
					rejectionReason: verification.rejectionReason,
					documents: verification.documents || [], // Обработка возможного отсутствия документов
				}));
				state.status = 'ready';
			})
			.addCase(fetchRejectedPassVerificationData.rejected, (state, action) => {
				state.status = 'error';
				state.error = action.payload || action.error.message;
			});
	},
});

export default rejectedPassVerificationSlice.reducer;
