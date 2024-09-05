import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
	data: [],
	status: 'idle', // 'idle' | 'loading' | 'ready' | 'error'
	error: null,
};

export const fetchBarcodeTypes = createAsyncThunk(
	'barcodeData/fetchBarcodeTypes',
	async () => {
		try {
			const response = await fetch('/user/get-all-barcode-types', {
				method: 'GET',
				redirect: 'follow',
			});

			if (!response.ok) {
				throw new Error('Failed to fetch barcode types');
			}

			const text = await response.text();
			// console.log('Ответ сервера (текст):', text); // Логгируем текст ответа
			const json = JSON.parse(text);

			return json; // Изменено с json.data на json, так как ответ сервера уже является массивом
		} catch (err) {
			console.log('Ошибка при запросе:', err); // Логгируем ошибки запроса
			return Promise.reject(err.message);
		}
	}
);


const barcodeDataSlice = createSlice({
	name: 'barcodeData',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchBarcodeTypes.pending, state => {
				state.status = 'loading';
			})
			.addCase(fetchBarcodeTypes.fulfilled, (state, action) => {
				//console.log('Data received in reducer:', action.payload); // Добавьте этот лог
				state.data = action.payload;
				state.status = 'ready';
			})
			.addCase(fetchBarcodeTypes.rejected, (state, action) => {
				state.status = 'error';
				state.error = action.error.message;
			});
	},
});

export default barcodeDataSlice.reducer;
