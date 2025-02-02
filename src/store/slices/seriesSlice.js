import {createAsyncThunk} from "@reduxjs/toolkit";

const initialState = {
    series: [],
    status: '',
    error: ''
};

export const fetchSeries = createAsyncThunk(
    "series/fetchSeries",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/service-centers/get-all-service-centers');
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            const data = await response.json(); // Предполагаем, что данные возвращаются в виде массива
            return data; // Возвращаем полученные данные
        } catch (error) {
            return rejectWithValue(error.message); // Обработка ошибки
        }
    }
);