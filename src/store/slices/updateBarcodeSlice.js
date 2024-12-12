import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Асинхронный экшен для обновления штрих-кода
export const updateBarcode = createAsyncThunk(
	'barcode/updateBarcode',
	async ({ id, code, used, bearerToken }, { rejectWithValue }) => {
		try {
			const myHeaders = new Headers();
			myHeaders.append('Content-Type', 'application/json');
			myHeaders.append('Accept', '*/*');
			myHeaders.append('Authorization', `Bearer ${bearerToken}`);

			const requestOptions = {
				method: 'PUT',
				headers: myHeaders,
				body: JSON.stringify({
					code,
					used,
				}),
				redirect: 'follow',
			};

			const response = await fetch(
				`/bonus-program/update-barcode/${id}`,
				requestOptions
			);

			if (!response.ok) {
				throw new Error(`Failed to update barcode with ID: ${id}`);
			}

			const result = await response.json(); // Ожидаем, что результат возвращается в формате JSON
			return result;
		} catch (error) {
			console.error('Error:', error);
			return rejectWithValue(error.message);
		}
	}
);

const updateBarcodeSlice = createSlice({
	name: 'updateBarcode',
	initialState: {
		barcodes: [],
		status: null,
		error: null,
	},
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(updateBarcode.pending, state => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(updateBarcode.fulfilled, (state, action) => {
				const updatedBarcodeIndex = state.barcodes.findIndex(
					barcode => barcode.id === action.payload.id
				);
				if (updatedBarcodeIndex !== -1) {
					state.barcodes[updatedBarcodeIndex] = action.payload;
				} else {
					state.barcodes.push(action.payload);
				}
				state.status = 'succeeded';
			})
			.addCase(updateBarcode.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			});
	},
});

export default updateBarcodeSlice.reducer;
