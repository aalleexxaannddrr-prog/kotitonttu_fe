import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

export const sendMessage = createAsyncThunk(
	'messages/sendMessage',
	async (
		{ senderId, receiverId, messageContent, bearerToken },
		{ rejectWithValue }
	) => {
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
				`/messages/send?senderId=${senderId}&receiverId=${receiverId}&messageContent=${encodeURIComponent(
					messageContent
				)}`,
				requestOptions
			);

			if (!response.ok) {
				const errorText = await response.text(); // Получаем текст ответа от API
				throw new Error('Failed to send message: ' + errorText);
			}

			return await response.text();
		} catch (error) {
			console.error('Error sending message:', error);
			return rejectWithValue(error.message);
		}
	}
);

const messagesSlice = createSlice({
	name: 'messages',
	initialState: {
		status: null,
		error: null,
	},
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(sendMessage.pending, state => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(sendMessage.fulfilled, state => {
				state.status = 'succeeded';
			})
			.addCase(sendMessage.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			});
	},
});

export default messagesSlice.reducer;
