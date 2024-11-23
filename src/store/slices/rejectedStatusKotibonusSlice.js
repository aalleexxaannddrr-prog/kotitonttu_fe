import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const rejectedStatusKotibonus = createAsyncThunk(
	'rejectedStatusKotibonus/reject',
	async ({ requestId, rejectionMessage, bearerToken }) => {
		const myHeaders = new Headers();
		myHeaders.append('Accept', '*/*');
		myHeaders.append('Authorization', `Bearer ${bearerToken}`);

		const url = `/bonus-program/updateStatus?requestId=${requestId}&status=REJECTED&rejectionMessage=${encodeURIComponent(
			rejectionMessage || ''
		)}`;

		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: myHeaders,
				redirect: 'follow',
			});

			if (!response.ok) {
				throw new Error('Failed to reject bonus request');
			}

			const result = await response.text();
			return result;
		} catch (error) {
			console.error('Ошибка при выполнении запроса:', error);
			throw error;
		}
	}
);

const rejectedStatusSlice = createSlice({
	name: 'rejectedStatusKotibonus',
	initialState: { status: 'idle', error: null },
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(rejectedStatusKotibonus.pending, state => {
				state.status = 'loading';
			})
			.addCase(rejectedStatusKotibonus.fulfilled, state => {
				state.status = 'succeeded';
			})
			.addCase(rejectedStatusKotibonus.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message;
			});
	},
});

export default rejectedStatusSlice.reducer;
