import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
	data: [], // Хранит массив объектов с email и documentVerifications
	status: 'idle',
	error: null,
};

// Асинхронное действие для получения данных верификаций со статусом PENDING
export const fetchPendingPassVerificationData = createAsyncThunk(
	'pendingPassVerificationData/fetchPendingPassVerificationData',
	async (_, { getState, rejectWithValue }) => {
		const state = getState();
		const bearerToken = state.auth?.bearerToken;

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
				'/bonus-program/get-all-document-verifications-request-by-parameter?requestStatus=PENDING',
				requestOptions
			);

			if (!response.ok) {
				throw new Error(
					`Ошибка запроса: ${response.status} ${response.statusText}`
				);
			}

			const result = await response.json();
			return result; // Возвращаем сырые данные
		} catch (error) {
			console.error('Ошибка при получении данных:', error);
			return rejectWithValue(error.message);
		}
	}
);

const pendingPassVerificationSlice = createSlice({
	name: 'pendingPassVerificationData',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchPendingPassVerificationData.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(fetchPendingPassVerificationData.fulfilled, (state, action) => {
				state.data = action.payload; // Сохраняем оригинальный ответ
				state.status = 'ready';
			})
			.addCase(fetchPendingPassVerificationData.rejected, (state, action) => {
				state.status = 'error';
				state.error = action.payload || action.error.message;
			});
	},
});

export default pendingPassVerificationSlice.reducer;
