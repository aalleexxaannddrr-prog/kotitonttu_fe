import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Начальное состояние
const initialState = {
	data: [],
	status: 'idle', // 'idle' | 'loading' | 'ready' | 'error'
	error: null,
};

// Асинхронное действие для получения данных верификаций со статусом APPROVED
export const fetchApprovedPassVerificationData = createAsyncThunk(
	'approvedPassVerificationData/fetchApprovedPassVerificationData',
	async (_, { getState, rejectWithValue }) => {
		const state = getState();
		const bearerToken = state.auth?.bearerToken; // Токен из auth

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
				'/bonus-program/get-all-document-verifications-request-by-parameter?requestStatus=APPROVED',
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
const approvedPassVerificationSlice = createSlice({
	name: 'approvedPassVerificationData',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchApprovedPassVerificationData.pending, state => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(fetchApprovedPassVerificationData.fulfilled, (state, action) => {
				state.data = action.payload; // Сохраняем оригинальные данные
				state.status = 'ready';
			})
			.addCase(fetchApprovedPassVerificationData.rejected, (state, action) => {
				state.status = 'error';
				state.error = action.payload || action.error.message;
			});
	},
});

export default approvedPassVerificationSlice.reducer;
