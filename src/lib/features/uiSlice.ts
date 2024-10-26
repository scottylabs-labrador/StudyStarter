import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { setUserId } from "firebase/analytics";

interface UIState {
  isModalOpen: boolean;
  isCreateGroupModalOpen: boolean;
}

const initialState: UIState = {
  isModalOpen: false,
  isCreateGroupModalOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setIsModalOpen(state, action: PayloadAction<boolean>) {
      state.isModalOpen = action.payload;
    },
    setIsCreateGroupModalOpen(state, action: PayloadAction<boolean>) {
      state.isCreateGroupModalOpen = action.payload;
    },
  },
});

export const { setIsModalOpen, setIsCreateGroupModalOpen } = uiSlice.actions;
export default uiSlice.reducer;
