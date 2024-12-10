import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const rejectedStatusKotibonus = createAsyncThunk(
	'rejectedStatusKotibonus/reject',
	async ({ requestId, rejectionMessage, bearerToken }) => {
		if (!bearerToken) throw new Error('Bearer token is missing');

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
				const errorText = await response.text();
				console.error('Ошибка от сервера:', errorText);
				throw new Error(errorText || 'Failed to reject bonus request');
			}

			return await response.text();
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
