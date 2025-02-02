import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

const initialState = {
    barcodes: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

export const addBarcode = createAsyncThunk(
    'barcodes/addBarcode',
    async (barcodeData, { rejectWithValue }) => {
        try {
            const barcodeFormData = new FormData();
            barcodeFormData.append('code', barcodeData.code);
            barcodeFormData.append('barcodeTypeId', barcodeData.type);

            const requestOptions = {
                method: 'POST',
                body: barcodeFormData,
                redirect: 'follow',
            };

            const response = await fetch('/bonus-program/add-barcode', requestOptions);

            if (!response.ok) {
                throw new Error('Failed to add barcode');
            }

            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const barcodeSlice = createSlice({
    name: 'barcodes',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(addBarcode.pending, state => {
                state.status = 'loading';
            })
            .addCase(addBarcode.fulfilled, (state, action) => {
                state.barcodeTypes.push(action.payload);
                state.status = 'succeeded';
            })
            .addCase(addBarcode.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            });
    },
});

export default barcodeSlice.reducer;
