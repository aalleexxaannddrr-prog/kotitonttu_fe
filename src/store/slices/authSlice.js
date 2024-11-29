import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Асинхронное действие для авторизации пользователя
export const loginUser = createAsyncThunk(
	'auth/loginUser',
	async ({ email, password }, { rejectWithValue }) => {
		try {
			const response = await fetch('/authentication/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: '*/*',
				},
				credentials: 'include', // Включаем отправку и получение куков
				body: JSON.stringify({ email, password }),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || 'Ошибка авторизации');
			}

			// После успешного ответа извлекаем и сохраняем токены
			handleLoginSuccess();

			// Возвращаем данные для использования в Redux (если требуется)
			return { email, isAuthenticated: true };
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

// Функция для извлечения токенов из куков и их сохранения в localStorage
const getTokensFromCookies = () => {
	const jwtMatch = document.cookie.match(/jwt-cookie=([^;]+)/);
	const refreshMatch = document.cookie.match(/refresh-jwt-cookie=([^;]+)/);

	const jwtToken = jwtMatch ? jwtMatch[1] : null;
	const refreshToken = refreshMatch ? refreshMatch[1] : null;

	if (jwtToken) localStorage.setItem('jwtToken', jwtToken);
	if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

	return { jwtToken, refreshToken };
};

// Основная функция для обработки успешного входа
const handleLoginSuccess = () => {
	const tokens = getTokensFromCookies();
	// console.log('JWT Token:', tokens.jwtToken);
	// console.log('Refresh Token:', tokens.refreshToken);
};

// Новый thunk для восстановления состояния авторизации из localStorage
export const restoreAuth = createAsyncThunk('auth/restoreAuth', async () => {
	const jwtToken = localStorage.getItem('jwtToken');
	const refreshToken = localStorage.getItem('refreshToken');
	const user = JSON.parse(localStorage.getItem('user'));

	if (jwtToken && refreshToken && user) {
		return {
			...user,
			bearerToken: jwtToken, // Устанавливаем jwtToken как bearerToken
		};
	}
	return null;
});

const authSlice = createSlice({
	name: 'auth',
	initialState: {
		user: null,
		bearerToken: null,
		isAuthenticated: false,
		status: 'idle',
		error: null,
		isLoading: true,
	},
	reducers: {
		logout: state => {
			state.user = null;
			state.bearerToken = null;
			state.isAuthenticated = false;
			state.isLoading = false;
			localStorage.removeItem('user'); // Удаляем данные из localStorage при выходе
			localStorage.removeItem('jwtToken');
			localStorage.removeItem('refreshToken');
		},
	},
	extraReducers: builder => {
		builder
			.addCase(loginUser.pending, state => {
				state.status = 'loading';
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.user = action.payload;
				state.isAuthenticated = true;
				state.bearerToken = localStorage.getItem('jwtToken'); // Устанавливаем bearerToken из localStorage
				state.isLoading = false;

				localStorage.setItem('user', JSON.stringify(action.payload));
				// console.log('Bearer token saved in auth state:', state.bearerToken);
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
				state.isLoading = false;
			})
			.addCase(restoreAuth.pending, state => {
				state.isLoading = true;
			})
			.addCase(restoreAuth.fulfilled, (state, action) => {
				if (action.payload) {
					state.user = action.payload;
					state.bearerToken = action.payload.bearerToken;
					state.isAuthenticated = true;
				} else {
					state.isAuthenticated = false;
				}
				state.isLoading = false;
			});
	},
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
