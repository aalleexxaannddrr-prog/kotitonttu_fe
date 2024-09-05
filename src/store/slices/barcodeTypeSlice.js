import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
	barcodeTypes: [],
	status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
	error: null,
};

export const addBarcodeType = createAsyncThunk(
	'barcodeTypes/addBarcodeType',
	async (barcodeTypeData, { rejectWithValue }) => {
		try {
			const response = await fetch('/admin/add-barcode-type', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(barcodeTypeData),
			});

			if (!response.ok) {
				throw new Error('Failed to add barcode type');
			}

			const result = await response.json();
			return result;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

const barcodeTypeSlice = createSlice({
	name: 'barcodeTypes',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(addBarcodeType.pending, state => {
				state.status = 'loading';
			})
			.addCase(addBarcodeType.fulfilled, (state, action) => {
				state.barcodeTypes.push(action.payload);
				state.status = 'succeeded';
			})
			.addCase(addBarcodeType.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload || action.error.message;
			});
	},
});

export default barcodeTypeSlice.reducer;
