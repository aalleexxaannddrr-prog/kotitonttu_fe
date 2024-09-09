import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Асинхронное действие для удаления barcode type по ID
export const deleteBarcodeType = createAsyncThunk(
	'barcodeTypes/deleteBarcodeType',
	async (id, { rejectWithValue }) => {
		const requestOptions = {
			method: 'DELETE',
			redirect: 'follow',
		};
		try {
			const response = await fetch(
				`/admin/delete-barcode-type/${id}`,
				requestOptions
			);
			if (!response.ok) {
				throw new Error('Failed to delete the barcode type');
			}
			return await response.text(); // Возвращаем результат в случае успеха
		} catch (error) {
			return rejectWithValue(error.message); // Возвращаем ошибку
		}
	}
);

const deleteBarcodeTypesSlice = createSlice({
	name: 'deleteBarcodeTypes',
	initialState: {
		barcodeTypes: [],
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(deleteBarcodeType.pending, state => {
				state.loading = true;
				state.error = null;
			})
			.addCase(deleteBarcodeType.fulfilled, (state, action) => {
				state.loading = false;
				state.barcodeTypes = state.barcodeTypes.filter(
					item => item.id !== action.meta.arg
				);
			})
			.addCase(deleteBarcodeType.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export default deleteBarcodeTypesSlice.reducer;
