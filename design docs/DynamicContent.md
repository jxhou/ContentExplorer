# **Dynamically update navigation pane (toolbar content) based on route selection **
Basically I want to update toolbar content, when different route is selected. Each component of route will have its own menu item in ng-template which will be injected into toolbar when selected.

Reference 2 discussed a solution to dynamically add route specific content to left navigation pane.

# **How to create dynamic content**
There are two types of views which can be created dynamically: 
1. Embedded views created from ng-template;
2. Hosted views created from Components;

There are also several ways of creating dynamic view from low to high levels.

## Creating embedded view
A template reference can be retrieved using @ViewChild such as 
```
@ViewChild("tpl") tpl: TemplateRef<any>;

```
or in a directive placed on a <ng-template> element, where a TemplateRef can be injected in its constructor.

tpl.createEmbeddedView() is the most fundamental way to create a view, which returns a ViewRef.

## Creating host view
 A component can be created dynamically using ComponentFactoryResolver:
```
 constructor(private injector: Injector,
            private r: ComponentFactoryResolver) {
    let factory = this.r.resolveComponentFactory(ColorComponent);
    let componentRef = factory.create(injector);
    let view = componentRef.hostView;
}

```
There are some lower level api to dynamically create a component and insert into DOM as discussed in reference 5:
```
@Injectable()
export class DomService {
  
  constructor(
      private componentFactoryResolver: ComponentFactoryResolver,
      private appRef: ApplicationRef,
      private injector: Injector
  ) { }
  
  appendComponentToBody(component: any) {
    // 1. Create a component reference from the component 
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(component)
      .create(this.injector);
    
    // 2. Attach component to the appRef so that it's inside the ng component tree
    this.appRef.attachView(componentRef.hostView);
    
    // 3. Get DOM element from component
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;
    
    // 4. Append DOM element to the body
    document.body.appendChild(domElem);
    
    // 5. Wait some time and remove it from the component tree and from the DOM
    setTimeout(() => {
        this.appRef.detachView(componentRef.hostView);
        componentRef.destroy();
    }, 3000);
  }
}

```
That is what really happening when dynamically create a component. There some higher level api to make the life a bit easier as below:

## ViewContainerRef
Represents a container where one or more views can be attached. Any DOM element can be used as a view container. Angular doesn’t insert views inside the element, but appends them after the element bound to ViewContainer. Usually, a good candidate to mark a place where a ViewContainer should be created is ng-container element. It’s rendered as a comment and so it doesn’t introduce redundant html elements into DOM. ng-template can also be used as viewContainer as HostPortal directive attached to. To access a ViewContainerRef of an Element, you can either place a Directive injected with ViewContainerRef on the Element, or you obtain it via a ViewChild query.  
Both host view and embedded view can be inserted into viewContainer manually as below:
```
@Component({
    selector: 'sample',
    template: `
        <span>I am first span</span>
        <ng-container #vc></ng-container>
        <span>I am last span</span>
        <template #tpl>
            <span>I am span in template</span>
        </template>
    `
})
export class SampleComponent implements AfterViewInit {
    @ViewChild("vc", {read: ViewContainerRef}) vc: ViewContainerRef;
    @ViewChild("tpl") tpl: TemplateRef<any>;

    ngAfterViewInit() {
        let view = this.tpl.createEmbeddedView(null);
        this.vc.insert(view);
    }
}

```
ViewContainer also provides API to create a view automatically, which is the more popular way to dynamically create views.
```
class ViewContainerRef {
    element: ElementRef
    length: number

    createComponent(componentFactory...): ComponentRef<C>
    createEmbeddedView(templateRef...): EmbeddedViewRef<C>
    ...
}

```
These are simply convenient wrappers to what we’ve done manually above. 

## ngTemplateOutlet and ngComponentOutlet
These are directives which abstracts dynamic creating views even further.  
**ngTemplateOutlet**
```
@Component({
  selector: 'ng-template-outlet-example',
  template: `
    <ng-container *ngTemplateOutlet="greet"></ng-container>
    <ng-template #greet><span>Hello</span></ng-template>
`
})
class NgTemplateOutletExample {
  myContext = {$implicit: 'World', localSk: 'Svet'};
}

```
**ngComponentOutlet**
```
@Component({selector: 'hello-world', template: 'Hello World!'})
class HelloWorld {
}
 
@Component({
  selector: 'ng-component-outlet-simple-example',
  template: `<ng-container *ngComponentOutlet="HelloWorld"></ng-container>`
})
class NgTemplateOutletSimpleExample {
  // This field is necessary to expose HelloWorld to the template.
  HelloWorld = HelloWorld;
}

```
### Portal and PortalOutlet (PortalHost before)
A common pattern developed in Angular Material (CDK) to ease the process of dynamically create views. Portal/PortalOutlet further abstract portal concept out of embedded view and host view. The PortalOutlet can attach any Portal, TemplatePortal or ComponentPortal. A PortalOutlet can be created out of any DOM element using query selector (DomPortalOutlent). Directive on ng-template to create a PortalHost.

## **References**: 
1. [Angular CDK Portals](https://blog.angularindepth.com/angular-cdk-portals-b02f66dd020c)  
[code demo](https://stackblitz.com/edit/angular-material2-portal-tools?embed=1&file=app/services/tool-options.service.ts)
2. [Advanced Angular Concepts by Alex Rickabaugh, AngularMIX](https://href.li/?https://www.youtube.com/watch?v=rKbY1t39dHU)   
[Left Nav Demo](https://stackblitz.com/edit/adv-ng-left-nav)
3. [Exploring Angular DOM manipulation techniques using ViewContainerRef](https://blog.angularindepth.com/exploring-angular-dom-abstractions-80b3ebcfc02)
4. [Implementing Dynamic Views in Angular](https://netbasal.com/implementing-dynamic-views-in-angular-20ae7c62fec3)  
[demo](https://stackblitz.com/edit/angular-router-basic-example-7zmukc?file=app%2Fapp.routing.module.ts)
5. [Angular ng-template, ng-container and ngTemplateOutlet - The Complete Guide To Angular Templates](https://blog.angular-university.io/angular-ng-template-ng-container-ngtemplateoutlet/)
6. [Angular Pro Tip: How to dynamically create components in <body>](https://medium.com/@caroso1222/angular-pro-tip-how-to-dynamically-create-components-in-body-ba200cc289e6)
7. [Create a dynamic tab component with Angular](https://juristr.com/blog/2017/07/ng2-dynamic-tab-component/)