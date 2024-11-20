import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
	data: [],
	status: 'idle',
	error: null,
};

export const fetchBarcodes = createAsyncThunk(
	'allBarcodeData/fetchBarcodes',
	async (bearerToken, { rejectWithValue }) => {
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

			const json = JSON.parse(text);
			if (!Array.isArray(json)) {
				throw new Error('Response is not an array');
			}

			return json;
		} catch (err) {
			console.error('Request error:', err.message);
			return rejectWithValue(err.message);
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
				console.error('Error in reducer:', action.error);
				state.status = 'error';
				state.error = action.payload;
			});
	},
});

export default allBarcodeDataSlice.reducer;
