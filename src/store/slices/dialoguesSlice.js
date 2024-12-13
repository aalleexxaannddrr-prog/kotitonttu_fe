import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchDialogues = createAsyncThunk(
	'dialogues/fetchDialogues',
	async ({ userId, bearerToken }, { rejectWithValue }) => {
		// Логи для проверки переданных параметров
		// console.log('fetchDialogues: userId:', userId);
		// console.log('fetchDialogues: bearerToken:', bearerToken);

		if (!userId || !bearerToken) {
			console.error(
				'Ошибка: Отсутствует токен или идентификатор пользователя.'
			);
			return rejectWithValue(
				'Ошибка: Отсутствует токен или идентификатор пользователя.'
			);
		}

		const myHeaders = new Headers();
		myHeaders.append('Accept', '*/*');
		myHeaders.append('Authorization', `Bearer ${bearerToken}`);

		const requestOptions = {
			method: 'GET',
			headers: myHeaders,
			redirect: 'follow',
		};

		try {
			const response = await fetch(
				`/messages/dialogues/${userId}`,
				requestOptions
			);

			// Логи ответа сервера
			// console.log('fetchDialogues: response status:', response.status);
         // console.log('fetchDialogues: параметры:', { userId, bearerToken });

			if (!response.ok) {
				const errorText = await response.text();
				console.error('Ошибка получения диалогов:', errorText);
				throw new Error(errorText || 'Failed to fetch dialogues');
			}

			const result = await response.json();
			// console.log('fetchDialogues: result:', result);
			return result;
		} catch (error) {
			console.error('Ошибка в fetchDialogues:', error.message);
			return rejectWithValue(error.message);
		}
	}
);


const dialoguesSlice = createSlice({
	name: 'dialogues',
	initialState: {
		data: [],
		status: null,
		error: null,
	},
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchDialogues.pending, state => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(fetchDialogues.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.data = action.payload;
			})
			.addCase(fetchDialogues.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			});
	},
});

export default dialoguesSlice.reducer;

