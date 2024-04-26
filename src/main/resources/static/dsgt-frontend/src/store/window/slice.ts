import { createSlice } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

const windowSmallSize = 768;
const windowSmallClassType = 'window-small';

const windowMediumSize = 1024;
const windowMediumClassType = 'window-medium';

export interface WindowSizeStateType {
  height: number;
  width: number;
  orientation: string;
  isWindowSmall: boolean;
  isWindowMedium: boolean;
  windowClassType: string;
}

const windowSizeSliceDefaultState: WindowSizeStateType = {
  height: 0,
  width: 0,
  orientation: '',
  isWindowSmall: false,
  isWindowMedium: false,
  windowClassType: '',
};

const windowSizeSlice = createSlice({
  name: 'windowSizeSlice',
  initialState: windowSizeSliceDefaultState,
  reducers: {
    resizeWindow: (state, action) => {
      const windowWidth = action.payload.width;
      const windowHeight = action.payload.height;
      let isWindowMedium = false;
      let isWindowSmall = false;
      let windowClassType = '';

      if (windowWidth >= windowSmallSize && windowWidth <= windowMediumSize) {
        isWindowMedium = true;
        windowClassType = windowMediumClassType;
      } else if (windowWidth < windowSmallSize) {
        isWindowSmall = true;
        windowClassType = windowSmallClassType;
      }

      return {
        height: windowHeight,
        width: windowWidth,
        orientation: windowWidth > windowHeight ? 'landscape' : 'portrait',
        isWindowSmall,
        isWindowMedium,
        windowClassType,
      };
    },
  },
});

export const { resizeWindow } = windowSizeSlice.actions;

export default combineReducers({
  windowSize: windowSizeSlice.reducer,
});
