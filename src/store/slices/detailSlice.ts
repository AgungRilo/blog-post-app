import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DataState {
    data: Record<string, any>;// Ubah tipe data sesuai kebutuhan Anda
}

const initialState: DataState = {
    data: {}, // Default state adalah array kosong
};

const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setData: (state, action: PayloadAction<any[]>) => {
            state.data = action.payload;
        },

        clearData: (state) => {
            state.data = [];
        },
    },
});

export const { setData, clearData } = dataSlice.actions;
export default dataSlice.reducer;
