import { createSlice } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

export interface DialogModalStateType {
  isModalOpen: boolean;
  modalObject: any;
  modalObjectStack: any[];
}

const dialogModalSliceDefaultState: DialogModalStateType = {
  isModalOpen: false,
  modalObject: null,
  modalObjectStack: [],
};

const dialogModalSlice = createSlice({
  name: 'dialogModalSlice',
  initialState: dialogModalSliceDefaultState,
  reducers: {
    openDialogModal: (state, action) => ({
      ...state,
      isModalOpen: true,
      modalObject: action.payload,
    }),
    closeDialogModal: (state) => ({
      ...state,
      isModalOpen: false,
      modalObject: null,
      modalObjectStack: [],
    }),
    reserveOpenDialogModal: (state, action) => {
      const modalObjectStack =
        state.modalObject === null
          ? [...state.modalObjectStack]
          : [...state.modalObjectStack, state.modalObject];
      return {
        ...state,
        modalObjectStack,
        isModalOpen: true,
        modalObject: action.payload,
      };
    },
    reserveCloseDialogModal: (state) => {
      let isModalOpen = false;
      let modalObject = null;
      const modalObjectStack = [...state.modalObjectStack];
      if (state.modalObjectStack.length !== 0) {
        isModalOpen = true;
        modalObject = modalObjectStack.pop();
      }
      return {
        ...state,
        modalObjectStack,
        isModalOpen,
        modalObject,
      };
    },
    keepLatestDialogModal: (state) => {
      let isModalOpen = false;
      let modalObject = null;
      let modalObjectStack = [...state.modalObjectStack];
      if (state.modalObjectStack.length !== 0) {
        modalObjectStack = modalObjectStack.splice(-1);
        isModalOpen = true;
        [modalObject] = modalObjectStack;
      }
      return {
        ...state,
        modalObjectStack,
        isModalOpen,
        modalObject,
      };
    },
  },
});

export const {
  openDialogModal,
  closeDialogModal,
  reserveOpenDialogModal,
  reserveCloseDialogModal,
  keepLatestDialogModal,
} = dialogModalSlice.actions;

export interface ContainerModalStateType {
  isModalOpen: boolean;
  modalObject: any;
}

const containerModalSliceDefaultState: ContainerModalStateType = {
  isModalOpen: false,
  modalObject: null,
};

const containerModalSlice = createSlice({
  name: 'containerModalSlice',
  initialState: containerModalSliceDefaultState,
  reducers: {
    openContainerModal: (state, action) => ({
      ...state,
      isModalOpen: true,
      modalObject: action.payload,
    }),
    closeContainerModal: (state) => ({
      ...state,
      isModalOpen: false,
      modalObject: null,
    }),
  },
});

export const { openContainerModal, closeContainerModal } =
  containerModalSlice.actions;

export default combineReducers({
  dialogModal: dialogModalSlice.reducer,
  containerModal: containerModalSlice.reducer,
});
