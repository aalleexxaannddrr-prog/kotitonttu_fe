import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Асинхронный экшен для обновления типа штрих-кода
export const updateBarcodeType = createAsyncThunk(
	'barcodeType/updateBarcodeType',
	async ({ id, points, type, subtype }, { rejectWithValue }) => {
		try {
			const requestOptions = {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ points, type, subtype }),
				redirect: 'follow',
			};

			const response = await fetch(
				`/bonus-program/update-barcode-type/${id}/type?`,
				requestOptions
			);
			if (!response.ok) {
				throw new Error(`Failed to update barcode type with ID: ${id}`);
			}

			const result = await response.json(); // Assuming the result is returned in JSON format
			return result;
		} catch (error) {
			console.error('Error:', error);
			return rejectWithValue(error.message);
		}
	}
);

const updateBarcodeTypeSlice = createSlice({
	name: 'updateBarcodeType',
	initialState: {
		barcodeTypes: [],
		status: null,
		error: null,
	},
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(updateBarcodeType.pending, state => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(updateBarcodeType.fulfilled, (state, action) => {
				const updatedTypeIndex = state.barcodeTypes.findIndex(
					type => type.id === action.payload.id
				);
				if (updatedTypeIndex !== -1) {
					state.barcodeTypes[updatedTypeIndex] = action.payload;
				}
				state.status = 'succeeded';
			})
			.addCase(updateBarcodeType.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			});
	},
});

export default updateBarcodeTypeSlice.reducer;
