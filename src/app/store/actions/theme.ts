import { Action } from '@ngrx/store';

export const SET_THEME = '[Theme] Set Theme';

export class SetThemeAction implements Action {
  readonly type = SET_THEME;
  constructor(public payload: string) {}
}

export type Actions = SetThemeAction;
