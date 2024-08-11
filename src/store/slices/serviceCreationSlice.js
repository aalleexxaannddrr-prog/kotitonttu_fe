import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
	services: [],
	status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
	error: null,
};

// export const addServiceCentre = createAsyncThunk(
// 	"serviceCreation/addServiceCentre",
// 	async (newCentre, { rejectWithValue }) => {
// 		try {
// 			const response = await fetch("/service-centres/add", {
// 				method: "POST",
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 				body: JSON.stringify(newCentre),
// 			});
// 			if (!response.ok) {
// 				throw new Error("Failed to post new service centre");
// 			}
// 			return await response.json(); // Возвращаем добавленный сервисный центр
// 		} catch (error) {
// 			return rejectWithValue(error.message);
// 		}
// 	}
// );

export const addServiceCentre = createAsyncThunk(
	"serviceCreation/addServiceCentre",
	async (newCentre, { rejectWithValue }) => {
		try {
			const response = await fetch("/service-centres/add", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newCentre),
			});

			if (!response.ok) {
				throw new Error("Failed to post new service centre");
			}

			const result = await response.json(); // Возвращаем добавленный сервисный центр
			window.location.reload(); // Перезагрузка страницы после успешного добавления
			return result;
		} catch (error) {
			return rejectWithValue(error.message); // Передаем ошибку
		}
	}
);

// Создание слайса
// const serviceCreationSlice = createSlice({
// 	name: "serviceCreation",
// 	initialState,
// 	reducers: {
// 		// Можно добавить обычные редьюсеры, если нужно
// 	},
// 	extraReducers: builder => {
// 		builder
// 			.addCase(addServiceCentre.pending, state => {
// 				state.status = "loading";
// 			})
// 			.addCase(addServiceCentre.fulfilled, (state, action) => {
// 				// Добавляем успешно добавленный сервисный центр в список
// 				state.services.push(action.payload);
// 				state.status = "succeeded";
// 			})
// 			.addCase(addServiceCentre.rejected, (state, action) => {
// 				// Обработка случаев, когда запрос не удался
// 				state.status = "failed";
// 				state.error = action.payload; // Или action.error.message, в зависимости от того, что возвращает rejectWithValue
// 			});
// 	},
// });

const serviceCreationSlice = createSlice({
	name: "serviceCreation",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(addServiceCentre.pending, state => {
				state.status = "loading"; // Устанавливаем статус в loading
			})
			.addCase(addServiceCentre.fulfilled, (state, action) => {
				// Проверка структуры данных перед добавлением
				if (action.payload && action.payload.id) {
					state.services.push(action.payload); // Добавляем новый сервисный центр в массив
					state.status = "succeeded"; // Устанавливаем статус в succeeded
				} else {
					state.status = "failed"; // Устанавливаем статус в failed при некорректных данных
					state.error = "Unexpected data format";
				}
			})
			.addCase(addServiceCentre.rejected, (state, action) => {
				state.status = "failed"; // Устанавливаем статус в failed
				state.error = action.payload || action.error.message; // Устанавливаем сообщение об ошибке
			});
	},
});

export default serviceCreationSlice.reducer;
