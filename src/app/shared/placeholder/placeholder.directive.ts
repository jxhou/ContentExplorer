import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appPlaceholder]'
})
export class PlaceholderDirective {

  // Get a reference to the host element
  constructor(public viewContainerRef: ViewContainerRef) { }

}
