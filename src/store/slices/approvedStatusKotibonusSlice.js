import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const approvedStatusKotibonus = createAsyncThunk(
	'approvedStatusKotibonus/approve',
	async ({ requestId, rejectionMessage, bearerToken }) => {
		if (!bearerToken) {
			throw new Error('Bearer token is missing');
		}

		const url = `/bonus-program/updateStatus?requestId=${requestId}&status=APPROVED&rejectionMessage=${encodeURIComponent(
			rejectionMessage || ''
		)}`;

		const myHeaders = new Headers();
		myHeaders.append('Accept', '*/*');
		myHeaders.append('Authorization', `Bearer ${bearerToken}`);

		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: myHeaders,
				redirect: 'follow',
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error('Ошибка от сервера:', errorText);
				throw new Error(errorText || 'Failed to approve bonus request');
			}

			return await response.text();
		} catch (error) {
			console.error('Ошибка при выполнении запроса:', error);
			throw error;
		}
	}
);

const approvedStatusSlice = createSlice({
	name: 'approvedStatusKotibonus',
	initialState: { status: 'idle', result: null, error: null },
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(approvedStatusKotibonus.pending, state => {
				state.status = 'loading';
			})
			.addCase(approvedStatusKotibonus.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.result = action.payload;
			})
			.addCase(approvedStatusKotibonus.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message;
			});
	},
});

export default approvedStatusSlice.reducer;
