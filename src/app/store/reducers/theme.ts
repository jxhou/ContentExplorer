import { createSelector } from '@ngrx/store';
import * as theme from '../actions/theme';

export interface State {
  themeName: string;
}

const initialState: State = {
  themeName: 'indigo-theme'
};

// Provide State as return of the reducer function and use spread operator enabling strict type checking by Typescript. 
export function reducer(state = initialState, action: theme.Actions): State {
  switch (action.type) {
    case theme.SET_THEME:
      return {
        ...state, themeName: action.payload,
      };

    default:
      return state;
  }
}

export const getThemeName = (state: State) => state.themeName;