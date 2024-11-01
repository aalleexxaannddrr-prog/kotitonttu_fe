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
			const response = await fetch('/bonus-program/get-all-barcode-types', {
				method: 'GET',
				redirect: 'follow',
			});

			if (!response.ok) {
				throw new Error(
					`Failed to fetch barcode types: ${response.status} ${response.statusText}`
				);
			}

			const text = await response.text();

			// Проверка, является ли ответ валидным JSON
			try {
				const json = JSON.parse(text);
				// Проверяем, что json является массивом
				if (!Array.isArray(json)) {
					throw new Error('Ответ сервера не является массивом');
				}
				return json; // Возвращаем данные
			} catch (parseError) {
				throw new Error('Ошибка парсинга JSON: ' + parseError.message);
			}
		} catch (err) {
			console.error('Ошибка при запросе:', err); // Логируем ошибки
			return Promise.reject(err.message); // Возвращаем ошибку с сообщением
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
				// console.log('Data received in reducer:', action.payload); // Добавляем лог
				state.data = action.payload;
				state.status = 'ready';
			})
			.addCase(fetchBarcodeTypes.rejected, (state, action) => {
				console.error('Error received in reducer:', action.error); // Логируем ошибку
				state.status = 'error';
				state.error = action.error.message;
			});
	},
});

export default barcodeDataSlice.reducer;
