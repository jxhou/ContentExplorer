import { createSelector } from '@ngrx/store';
import * as theme from '../actions/theme';
import { LocalStorageService } from '@app/core/local-storage/local-storage.service';

const LocalStorageServiceInst = new LocalStorageService();

export interface State {
  themeName: string;
};

// get theme status from local storage
const themeLocalStorage = LocalStorageServiceInst.getItem('theme');

const initialState: State = themeLocalStorage ? themeLocalStorage : {
  themeName: 'indigo-theme'
};

// Provide State as return of the reducer function and use spread operator enabling strict type checking by Typescript. 
export function reducer(state = initialState, action: theme.Actions): State {
  switch (action.type) {
    case theme.SET_THEME:
      const themeSetting = {
        ...state, themeName: action.payload,
      };
      LocalStorageServiceInst.setItem('theme', themeSetting);
      return themeSetting;

    default:
      return state;
  }
};

export const getThemeName = (state: State) => state.themeName;