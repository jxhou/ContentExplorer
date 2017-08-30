import { createSelector } from '@ngrx/store';
import * as theme from '../actions/theme';

export interface State {
  themeName: string;
}

const initialState: State = {
  themeName: 'indigo-theme'
};