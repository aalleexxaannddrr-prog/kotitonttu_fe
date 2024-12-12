import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Асинхронное действие для удаления штрих-кода по ID
export const deleteBarcode = createAsyncThunk(
	'barcodes/deleteBarcode',
	async ({ id, bearerToken }, { rejectWithValue }) => {
		const myHeaders = new Headers();
		myHeaders.append('Accept', '*/*');
		myHeaders.append('Authorization', `Bearer ${bearerToken}`);

		const requestOptions = {
			method: 'DELETE',
			headers: myHeaders,
			redirect: 'follow',
		};

		try {
			const response = await fetch(
				`/bonus-program/delete-barcode/${id}`,
				requestOptions
			);

			if (!response.ok) {
				throw new Error('Failed to delete the barcode');
			}

			return await response.text(); // Возвращаем результат в случае успеха
		} catch (error) {
			console.error('Error:', error);
			return rejectWithValue(error.message); // Возвращаем ошибку
		}
	}
);

const deleteBarcodeSlice = createSlice({
	name: 'deleteBarcode',
	initialState: {
		barcodes: [],
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(deleteBarcode.pending, state => {
				state.loading = true;
				state.error = null;
			})
			.addCase(deleteBarcode.fulfilled, (state, action) => {
				state.loading = false;
				state.barcodes = state.barcodes.filter(
					item => item.id !== action.meta.arg.id
				);
			})
			.addCase(deleteBarcode.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export default deleteBarcodeSlice.reducer;
