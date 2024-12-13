import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

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

// Thunk для получения userId по email
export const fetchUserIdAfterLogin = createAsyncThunk(
	'auth/fetchUserIdAfterLogin',
	async ({ email, bearerToken }, { rejectWithValue }) => {
		try {
			const response = await fetch('/admin/allUsers?page=0&size=10', {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${bearerToken}`,
				},
			});

			if (!response.ok) {
				throw new Error('Failed to fetch userId');
			}

			const data = await response.json();
			const user = data.users.find(user => user.email === email);

			if (!user) {
				throw new Error('User not found');
			}

			return user.id; // Возвращаем userId
		} catch (error) {
			console.error('Error in fetchUserIdAfterLogin:', error);
			return rejectWithValue(error.message);
		}
	}
);

// Асинхронное действие для авторизации пользователя
export const loginUser = createAsyncThunk(
	'auth/loginUser',
	async ({ email, password }, { dispatch, rejectWithValue }) => {
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

			// Обработка успешного логина и сохранения токенов
			handleLoginSuccess();

			// Извлекаем токены из localStorage
			const jwtToken = localStorage.getItem('jwtToken');
			const refreshToken = localStorage.getItem('refreshToken');

			if (!jwtToken) {
				throw new Error('JWT Token not found after login');
			}

			// Получаем userId после авторизации
			const userId = await dispatch(
				fetchUserIdAfterLogin({
					email,
					bearerToken: jwtToken,
				})
			).unwrap();

			// Сохраняем данные пользователя в localStorage
			const user = { email, isAuthenticated: true, userId };
			localStorage.setItem('user', JSON.stringify(user));

			return { ...user, jwtToken, refreshToken };
		} catch (error) {
			console.error('Error in loginUser:', error);
			return rejectWithValue(error.message);
		}
	}
);

// Новый thunk для восстановления состояния авторизации из localStorage
export const restoreAuth = createAsyncThunk(
	'auth/restoreAuth',
	async (_, { dispatch }) => {
		const jwtToken = localStorage.getItem('jwtToken');
		const user = JSON.parse(localStorage.getItem('user'));

		if (jwtToken && user) {
			if (!user.userId) {
				try {
					const userId = await dispatch(
						fetchUserIdAfterLogin({ email: user.email, bearerToken: jwtToken })
					).unwrap();

					const updatedUser = { ...user, userId };
					localStorage.setItem('user', JSON.stringify(updatedUser));
					return { ...updatedUser, bearerToken: jwtToken };
				} catch (error) {
					console.error('Error in restoreAuth:', error);
				}
			}
			return { ...user, bearerToken: jwtToken };
		}

		return null;
	}
);

const authSlice = createSlice({
	name: 'auth',
	initialState: {
		userId: null,
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
				state.error = null;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.user = action.payload;
				state.userId = action.payload.userId;
				state.isAuthenticated = true;
				state.bearerToken = action.payload.jwtToken;
				state.isLoading = false;
			})
			.addCase(fetchUserIdAfterLogin.fulfilled, (state, action) => {
				state.userId = action.payload;

				const user = JSON.parse(localStorage.getItem('user'));
				localStorage.setItem(
					'user',
					JSON.stringify({ ...user, userId: action.payload })
				);
			})
			.addCase(restoreAuth.fulfilled, (state, action) => {
				if (action.payload) {
					state.user = action.payload;
					state.userId = action.payload.userId;
					state.bearerToken = action.payload.bearerToken;
					state.isAuthenticated = true;
				} else {
					state.isAuthenticated = false;
				}
				state.isLoading = false;
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
				state.isLoading = false;
			})
			.addCase(fetchUserIdAfterLogin.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			});
	},
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
