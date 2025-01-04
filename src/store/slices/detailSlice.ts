import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post } from '@/components/interface';

interface DataState {
    data: Post | null; // Gunakan tipe Post atau null jika default kosong
}

const initialState: DataState = {
    data: null, // Default state adalah null
};

const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setData: (state, action: PayloadAction<Post>) => {
            state.data = action.payload; // Hanya menerima satu objek Post
        },

        clearData: (state) => {
            state.data = null; // Reset data ke null
        },
    },
});

export const { setData, clearData } = dataSlice.actions;
export default dataSlice.reducer;
