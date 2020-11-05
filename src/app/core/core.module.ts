import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { LocalStorageService } from './local-storage/local-storage.service';
import { AuthComponent } from './components/auth/auth.component';
import { SharedModule } from '@app/shared';
// import { CoalescingComponentFactoryResolver } from './coalescing-component-factory-resolver.service';

@NgModule({
  imports: [
    CommonModule, // we use ngFor
    SharedModule
  ],
  exports: [AuthComponent],
  declarations: [AuthComponent],
  providers: [LocalStorageService]
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
