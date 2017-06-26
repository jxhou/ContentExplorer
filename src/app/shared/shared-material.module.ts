// This is the shared module including all the material components used in current projects.
// More components should be added, once it is needed.
import { NgModule } from '@angular/core';
import 'hammerjs';
import { MdInputModule, MdButtonModule, MdButtonToggleModule, 
         MdCheckboxModule, MdRadioModule, 
         MdSelectModule, MdAutocompleteModule,
         MdCardModule, MdListModule, MdTabsModule,
         MdMenuModule, MdSidenavModule, MdToolbarModule,
         MdIconModule, MdChipsModule,
         MdDialogModule, MdSnackBarModule } from '@angular/material';

@NgModule({
  imports: [
    //Material
    MdInputModule, MdButtonModule, MdButtonToggleModule, 
    MdCheckboxModule, MdRadioModule, 
    MdSelectModule, MdAutocompleteModule, 
    MdCardModule, MdListModule, MdTabsModule,
    MdMenuModule, MdSidenavModule, MdToolbarModule,
    MdIconModule, MdChipsModule,
    MdDialogModule, MdSnackBarModule
  ],
  exports:  [ MdInputModule, MdButtonModule, MdButtonToggleModule, 
              MdCheckboxModule, MdRadioModule, 
              MdSelectModule, MdAutocompleteModule,
              MdCardModule, MdListModule, MdTabsModule,
              MdMenuModule, MdSidenavModule, MdToolbarModule,
              MdIconModule, MdChipsModule,
              MdDialogModule, MdSnackBarModule ]
})
export class SharedMaterialModule { }
