import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
	data: [],
	status: 'idle',
	error: null,
};

export const fetchBarcodes = createAsyncThunk(
	'allBarcodeData/fetchBarcodes',
	async bearerToken => {
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
				'/bonus-program/all-barcode',
				requestOptions
			);

			if (!response.ok) {
				throw new Error(
					`Failed to fetch barcodes: ${response.status} ${response.statusText}`
				);
			}

			const text = await response.text();
			console.log('Raw response text:', text); // Логирование текста ответа

			try {
				const json = JSON.parse(text);
				if (!Array.isArray(json)) {
					throw new Error('Response is not an array');
				}
				console.log('Parsed JSON response:', json); // Логирование JSON после парсинга
				return json;
			} catch (parseError) {
				console.error('JSON parsing error:', parseError.message);
				throw new Error('JSON parsing error: ' + parseError.message);
			}
		} catch (err) {
			console.error('Request error:', err); // Логирование ошибок запроса
			return Promise.reject(err.message);
		}
	}
);

const allBarcodeDataSlice = createSlice({
	name: 'allBarcodeData',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchBarcodes.pending, state => {
				state.status = 'loading';
			})
			.addCase(fetchBarcodes.fulfilled, (state, action) => {
				state.data = action.payload;
				state.status = 'ready';
			})
			.addCase(fetchBarcodes.rejected, (state, action) => {
				console.error('Error in reducer:', action.error); // Логирование ошибки
				state.status = 'error';
				state.error = action.error.message;
			});
	},
});

export default allBarcodeDataSlice.reducer;
