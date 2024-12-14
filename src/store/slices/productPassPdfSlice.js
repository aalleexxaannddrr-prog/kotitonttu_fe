import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk для загрузки PDF-файла
export const uploadProductPassPdf = createAsyncThunk(
	'productPassPdf/uploadProductPassPdf',
	async ({ bearerToken, pdf }, { rejectWithValue }) => {
		const myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');
		myHeaders.append('Accept', '*/*');
		myHeaders.append('Authorization', `Bearer ${bearerToken}`);

		const raw = JSON.stringify({ pdf });

		const requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: raw,
			redirect: 'follow',
		};

		try {
			const response = await fetch(
				'/boiler-series-passport/add',
				requestOptions
			);

			if (!response.ok) {
				throw new Error('Failed to upload Product Passport PDF');
			}

			const result = await response.text();
			return result;
		} catch (error) {
			console.error('Error uploading Product Passport PDF:', error);
			return rejectWithValue(error.message);
		}
	}
);

const productPassPdfSlice = createSlice({
	name: 'productPassPdf',
	initialState: {
		status: null,
		error: null,
		result: null,
	},
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(uploadProductPassPdf.pending, state => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(uploadProductPassPdf.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.result = action.payload;
			})
			.addCase(uploadProductPassPdf.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			});
	},
});

export default productPassPdfSlice.reducer;
