import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Асинхронный экшен для удаления сервисного центра
export const deleteServiceCenter = createAsyncThunk(
	"serviceDeletionSlice/deleteServiceCenter",
	async (id, { rejectWithValue }) => {
		try {
			const response = await fetch(`/service-centers/delete-by-id/${id}`, {
				method: 'DELETE',
			});
			if (!response.ok) {
				throw new Error("Ошибка при удалении сервисного центра");
			}
			// Перезагрузка страницы после успешного удаления
			window.location.reload();
			return id;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

const serviceDeletionSlice = createSlice({
	name: "serviceDeletionSlice",
	initialState: {
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(deleteServiceCenter.pending, state => {
				state.loading = true;
			})
			.addCase(deleteServiceCenter.fulfilled, state => {
				state.loading = false;
			})
			.addCase(deleteServiceCenter.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export default serviceDeletionSlice.reducer;
