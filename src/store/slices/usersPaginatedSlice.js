import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    users: [],
    currentPage: 0,
    totalPages: 0,
    status: '',
    error: '',
};

export const fetchUsersPag = createAsyncThunk('users/fetchUsersPag', async (page) => {
    try {
        const responseText = `/admin/allUsers?page=${page || 0}&size=3`
        const response = await fetch(responseText, {
            method: 'GET',
            redirect: 'follow',
        });
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }

        const json = await response.json();

        return {
            users: json.users,
            currentPage: json.pageNumber,
            totalPages: json.totalPages
        };
    } catch (err) {
        console.error('Error fetching users:', err);
        return Promise.reject(err.message);
    }
});

const usersPaginatedSlice = createSlice({
    name: 'usersPag',
    initialState,
    reducers: {
        resetUsers: (state) => {
            state.users = []; // Сбрасываем пользователей
            state.currentPage = 0; // Сбрасываем страницу на 0
            state.totalPages = 0; // Очистка общего количества страниц
            state.status = '';
            state.error = '';
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchUsersPag.pending, state => {
                state.status = 'loading';
            })
            .addCase(fetchUsersPag.fulfilled, (state, action) => {
                state.users = [...state.users, ...action.payload.users];
                state.currentPage = action.payload.currentPage;
                state.totalPages = action.payload.totalPages
                state.status = 'ready';
            })
            .addCase(fetchUsersPag.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.error.message;
            });
    },
});

export const { resetUsers } = usersPaginatedSlice.actions;
export default usersPaginatedSlice.reducer;