import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Асинхронное действие для добавления новой запчасти
export const addSparePart = createAsyncThunk(
	'spareParts/addSparePart',
	async ({ dto, image, bearerToken }, { rejectWithValue }) => {
		const myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');
		myHeaders.append('Accept', '*/*');
		myHeaders.append('Authorization', `Bearer ${bearerToken}`);

		const raw = JSON.stringify({
			dto,
			image,
		});

		const requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: raw,
			redirect: 'follow',
		};

		try {
			const response = await fetch('/spare-part/add', requestOptions);

			if (!response.ok) {
				throw new Error('Failed to add spare part');
			}

			const result = await response.json(); // Ожидаем, что результат возвращается в формате JSON
			return result;
		} catch (error) {
			console.error('Error:', error);
			return rejectWithValue(error.message); // Возвращаем ошибку
		}
	}
);

const addSparePartSlice = createSlice({
	name: 'addSparePart',
	initialState: {
		data: null,
		status: null,
		error: null,
	},
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(addSparePart.pending, state => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(addSparePart.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.data = action.payload;
			})
			.addCase(addSparePart.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			});
	},
});

export default addSparePartSlice.reducer;
