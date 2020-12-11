# A Simple Messagebox implementation

A simple message box is implemented in:
>D:\github\ContentExplorer\src\app\shared\alert\alert.component.ts

This component takes a message as input and fire an event when close. It is the host component to determine how to open and close it.

The trick of css z-index is used to set the back-drop plane and float the message box above all other elements.

> D:\github\ContentExplorer\src\app\shared\alert\alert.component.scss

```
.back-drop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.75);
    z-index: 50;
}

.alert-box {
    position: fixed;
    top: 20vh;
    left: 20vw;
    right: 20vw;
    padding: 16px;
    z-index: 100;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
}

.alert-box-actions {
    text-align: center;
}
```

The messageBox can be declaratively displayed by adding the <app-alert> element to host page, and show and hide it accordingly.

It can also be dynamically created, inserted and cleared from DOM based in the events.

See the usages of the alert-box in:

> In D:\github\ContentExplorer\src\app\features\test-module\main\main.component.html
<ng-template appPlaceholder></ng-template>
A directive of appPlaceholder is placed on the </ng-template> in order to query the place holder. The appPlaceholder is used to get a templateRef to the ng-template.

> In D:\github\ContentExplorer\src\app\features\test-module\main\main.component.ts
 @ViewChild(PlaceholderDirective) host: PlaceholderDirective;
 To retrieve the directive and its templateRef, and

```
 onShowAlterImperatively() {
    const factory: ComponentFactory<AlertComponent> = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    this.host.viewContainerRef.clear();
    const alertRef = this.host.viewContainerRef.createComponent(factory);

    // pass input parameter to the component
    alertRef.instance.message = " this message is displayed in an imperatively created alert component";

    // subscribe the event from the component
    this.closeSub = alertRef.instance.closed.subscribe(() => {
      this.host.viewContainerRef.clear();
      this.closeSub.unsubscribe()
    })
  }
  ```
