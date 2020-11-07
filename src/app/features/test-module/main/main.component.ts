import { Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PlaceholderDirective } from '@app/shared/placeholder/placeholder.directive';
import { AlertComponent } from "@app/shared/alert/alert.component";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy{
  @ViewChild(PlaceholderDirective) host: PlaceholderDirective;
  showDeclaredAlert: boolean = false;
  private closeSub: Subscription;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
  }
  
  ngOnDestroy(): void {
    this.closeSub && this.closeSub.unsubscribe();
  }

  onOpenDeclaredAlert() {
    this.showDeclaredAlert = true;
  }

  onCloseDeclarativeAlert() {
    this.showDeclaredAlert = false;
  }

  onShowAlterImperatively() {
    const factory: ComponentFactory<AlertComponent> = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    this.host.viewContainerRef.clear();
    const alertRef = this.host.viewContainerRef.createComponent(factory);
    
    // pass imput parameter to the component
    alertRef.instance.message = " this message is displayed in an imperatively created alert component";

    // subscribe the event from the component
    this.closeSub = alertRef.instance.closed.subscribe(() => {
      this.host.viewContainerRef.clear();
      this.closeSub.unsubscribe()
    })
  }

}
