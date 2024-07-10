import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


const initialState ={
   services: [],
   currentTypes: null,
   status: "",
   erroe: "",
};

export const fetchServiceCentres = createAsyncThunk("services/fetchServiceCentres", 
   async () => {
      try {
         const res = await fetch('/service-centres/getAll');
         const text = await res.text();
         console.log("Full respons text: ", text);

         if (!res.ok){
            throw new Error("Failed to fetch data");
         }

         const json = JSON.parse(text);
         console.log("Fetched types: ", json);

         return json.services
      } catch (err) {
         console.log("Error fetching types", err.message);
         return Promise.reject(err.message)
      }
   }
);

const servicesSlice = createSlice({
   name: 'services',
   initialState,
   reducers: {},
   extraReducers: builder => {
      builder.addCase(fetchServiceCentres.pending, state => {
         state.status = 'loading'
      }).addCase(fetchServiceCentres.fulfilled, (state, action) => {
         state.services = action.payload;
         state.status = 'ready';
      }).addCase(fetchServiceCentres.rejected, (state, action) => {
         state.status = "error";
         state.action = action.error.message;
      }
      )}
});

export default servicesSlice.reducer;