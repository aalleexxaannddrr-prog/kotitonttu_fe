import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Асинхронное действие для обновления запчасти по ID
export const updateSparePartById = createAsyncThunk(
	'spareParts/updateSparePartById',
	async ({ id, dto, image, bearerToken }, { rejectWithValue }) => {
		const myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');
		myHeaders.append('Accept', '*/*');
		myHeaders.append('Authorization', `Bearer ${bearerToken}`);

		const raw = JSON.stringify({
			dto,
			image,
		});

		const requestOptions = {
			method: 'PUT',
			headers: myHeaders,
			body: raw,
			redirect: 'follow',
		};

		try {
			const response = await fetch(
				`/spare-part/update-by-id/${id}`,
				requestOptions
			);

			if (!response.ok) {
				throw new Error('Failed to update spare part');
			}

			const result = await response.json(); // Ожидаем, что результат возвращается в формате JSON
			return result;
		} catch (error) {
			console.error('Error:', error);
			return rejectWithValue(error.message); // Возвращаем ошибку
		}
	}
);

const updateSparePartSlice = createSlice({
	name: 'updateSparePart',
	initialState: {
		data: null,
		status: null,
		error: null,
	},
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(updateSparePartById.pending, state => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(updateSparePartById.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.data = action.payload;
			})
			.addCase(updateSparePartById.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			});
	},
});

export default updateSparePartSlice.reducer;
