import { createStore, applyMiddleware, compose } from '@reduxjs/toolkit';
import rootReducer from './reducers';
import { loadState, saveState } from './../utils/helpers/LocalStorage'

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const persistedState = loadState();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  persistedState, // Load persisted state here
  composeEnhancers(applyMiddleware())
);

// Subscribe to store updates to save state to localStorage
store.subscribe(() => {
  saveState({
    user: store.getState().user,
  });
});

export type RootState = ReturnType<typeof store.getState>;

export default store
