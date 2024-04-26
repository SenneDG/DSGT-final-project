import { createSlice } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import JSONType from '../../utils/interfaces/JsonInterface';

import english from '../../assets/i18n/english.json';

export interface LanguageStateType {
  languageName: string;
  languageObject: any;
}

const languageSliceDefaultState: LanguageStateType = {
  languageName: 'english',
  languageObject: english,
};

const translateObject: {
  english: JSONType;
} = {
  english,
};

const languageSlice = createSlice({
  name: 'languageSlice',
  initialState: languageSliceDefaultState,
  reducers: {
    switchLanguage: (state, action) => {
      const selectedLanguage = action.payload;
      return {
        languageName: selectedLanguage,
        // @ts-ignore
        languageObject: translateObject[selectedLanguage],
      };
    },
  },
});

export const { switchLanguage } = languageSlice.actions;

export default combineReducers({
  languageInfo: languageSlice.reducer,
});
