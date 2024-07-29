// features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Асинхронный экшн для входа
export const loginUser = createAsyncThunk(
	"auth/login",
	async ({ email, password }, thunkAPI) => {
		try {
			const response = await fetch("http://31.129.102.70:8080/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			let data = await response.json();
			if (response.status === 200) {
				if (data.status === "error") {
					return thunkAPI.rejectWithValue(data.notify);
				}
				return data; // Предполагаем, что здесь возвращаются токены
			} else {
				return thunkAPI.rejectWithValue(data.notify);
			}
		} catch (error) {
			return thunkAPI.rejectWithValue(error.message);
		}
	}
);

// Создание слайса
const authSlice = createSlice({
	name: "auth",
	initialState: {
		user: null,
		isLoading: false,
		error: null,
	},
	reducers: {
		// Опционально: редьюсеры для других действий
	},
	extraReducers: builder => {
		builder
			.addCase(loginUser.pending, state => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.isLoading = false;
				state.user = action.payload; // Сохранение данных пользователя или токенов
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload; // Сохранение ошибки
			});
	},
});

export default authSlice.reducer;
