import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { setUserId } from "firebase/analytics";

interface UIState {
  isModalOpen: boolean;
  isCreateGroupModalOpen: boolean;
  isProfileOpen: boolean;
  isViewProfileOpen: boolean;

}

const initialState: UIState = {
  isModalOpen: false,
  isCreateGroupModalOpen: false,
  isProfileOpen: false,
  isViewProfileOpen: false,
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
    setIsProfileOpen(state, action: PayloadAction<boolean>) {
      state.isProfileOpen = action.payload;
    },
    setIsViewProfileOpen(state, action: PayloadAction<boolean>) {
      state.isViewProfileOpen = action.payload;
    },
  },
});

export const { setIsModalOpen, setIsCreateGroupModalOpen, setIsProfileOpen, setIsViewProfileOpen} = uiSlice.actions;
export default uiSlice.reducer;
