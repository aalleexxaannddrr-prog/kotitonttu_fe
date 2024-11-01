import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const loginUser = createAsyncThunk(
	'auth/loginUser',
	async ({ email, password, bearerToken }, { rejectWithValue }) => {
		try {
			const response = await fetch('/authentication/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: '*/*',
					Authorization: `Bearer ${bearerToken}`,
				},
				body: JSON.stringify({ email, password }),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || 'Ошибка авторизации');
			}

			const contentType = response.headers.get('content-type');
			let data;
			if (contentType && contentType.includes('application/json')) {
				data = await response.json();
			} else {
				data = { email };
			}

			return data;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

// Новый thunk для восстановления состояния авторизации из localStorage
export const restoreAuth = createAsyncThunk('auth/restoreAuth', async () => {
	const storedUser = localStorage.getItem('user');
	if (storedUser) {
		return JSON.parse(storedUser); // Если данные найдены, возвращаем их
	}
	return null;
});

const authSlice = createSlice({
	name: 'auth',
	initialState: {
		user: null,
		isAuthenticated: false,
		status: 'idle',
		error: null,
		isLoading: true, // Флаг для отслеживания загрузки
	},
	reducers: {
		logout: (state) => {
			state.user = null;
			state.isAuthenticated = false;
			state.isLoading = false;
			localStorage.removeItem('user'); // Удаляем данные из localStorage при выходе
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loginUser.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.user = action.payload;
				state.isAuthenticated = true;
				state.isLoading = false; // Завершаем загрузку
				localStorage.setItem('user', JSON.stringify(action.payload));
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
				state.isLoading = false;
			})
			.addCase(restoreAuth.pending, (state) => {
				state.isLoading = true; // Начинаем загрузку
			})
			.addCase(restoreAuth.fulfilled, (state, action) => {
				if (action.payload) {
					state.user = action.payload;
					state.isAuthenticated = true;
				} else {
					state.isAuthenticated = false;
				}
				state.isLoading = false; // Завершаем загрузку
			});
	},
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
