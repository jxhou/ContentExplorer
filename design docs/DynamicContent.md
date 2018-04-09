# **Dynamically update navigation pane (toolbar content) based on route selection**
Basically I want to update toolbar content, when different route is selected. Each component of route will have its own menu item in ng-template which will be injected into toolbar when selected.

## Reference implementations  
Reference 2 discussed a solution to dynamically add route specific content to left navigation pane.  
ng-template, structural directive, ng-container @ViewChild selected ViewContainerRef, and Left.Nav.Service are the pieces of the solution. Low level dynamic api was used to achieve the dynamic content. The LeftNavComponent has a LeftNav service injected to receive new content, and then dynamically render at specified ng-container location using ViewContainerRef.createEmbeddedView. In this case, the LeftNavComponent, the content receiver, is a smart component.

Reference 1 is about a usage of Portal/PortalOutlet, and shows an example of sending a dynamic ng-template content from one of the ToolComponent (CropTool, DrawTool, or TextTool) upon selection, to ToolOptionsComponent, which is exact same idea as reference 1, but implemented using Portal/PortalOutlet. There is a ToolOptionsService which is injected into both source and receiving ends, as a bridge to pass content from any ToolComponent to ToolOptionsComponent.

Reference 5 shows an example of ngTemplateOutlet usage, where TabContainerComponent takes a headerTemplate of TemplateRef<any>, as @Input, and assign it to <ng-container *ngTemplateOutlet="headerTemplate"> </ng-container> directly. In this case, TabContainerComponent is a dumb component, and ngTemplateOutlet directive is used to dynamically accept content from outside of the component. 

ngTemplateOutlet/ngComponentOutlet and Portal/PortalOutlet are equally terse in creating dynamic content. The former comes with angular, the later need extra dependency on material, but further abstract the difference between template and component.

ngTemplateOutlet is the way I am going to use to implement my toolbar with dynamic content, to save extra dependency on material package compare to Portal/PortalOutlet.

## My implementation details

--------------------
# Dynamic component, ComponentFactory, and EntryComponents
In angular, every component is created via component factory. The component factories are created by angular compiler by parsing the template in components, which are static and declarative. However the dynamic components are not declared in template. In order for angular to create components dynamically, the component has to be declared in NgModule's entryComponents. Angular can also implicitly declare entry Component, such as bootstrap component, components in route definition, to save extra task for user. So angular will also create component factories for all the components declared as entry component explicitly and implicitly.

Each module provides a convenient service for all its components to get a component factory. This service is ComponentFactoryResolver. So, if you define a BComponent on the module and want to get a hold of its factory you can use this service from a component belonging to this module:
This only works if both components are defined in the same module or if a module with a resolved component factory is imported.

# Use ANALYZE_FOR_ENTRY_COMPONENTS to dynamically declare EntryComponents
Straight from angular.io, ANALYZE_FOR_ENTRY_COMPONENTS token can be used to create a virtual provider that will populate the entryComponents fields of components and ng modules based on its useValue. All components that are referenced in the useValue value (either directly or in a nested array or map) will be added to the entryComponents property.

```
// helper function inside the router
function provideRoutes(routes) {
  return [
    {provide: ROUTES, useValue: routes},
    {provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: routes, multi: true}
  ];
}

// user code
let routes = [
  {path: '/root', component: RootComp},
  {path: '/teams', component: TeamsComp}
];

@NgModule({
  providers: [provideRoutes(routes)]
})
class ModuleWithRoutes {}
```

The dynamic entry components declaration is actually in the format of providers. As the above code example shows how to use ANALYZE_FOR_ENTRY_COMPONENTS token, it is also the implementation of provideRoutes function of Angular, which uses ANALYZE_FOR_ENTRY_COMPONENTS trick internally.

# Dynamically declare routes:
As the example shown above, Angular has provideRoutes function using ANALYZE_FOR_ENTRY_COMPONENTS token to dynamically declare routes. The above code shows that routes are declared using two tokens: ROUTES and ANALYZE_FOR_ENTRY_COMPONENTS. [RouterModule.forRoot()](https://github.com/angular/angular/blob/5298b2bda34a8766b28c8425e447f94598b23901/packages/router/src/router_module.ts#L142), and [RouterModule.forChild()](https://github.com/angular/angular/blob/5298b2bda34a8766b28c8425e447f94598b23901/packages/router/src/router_module.ts#L175) actually use above provideRoutes function to declare routes.  

Therefore provideRoutes function is not much different from either RouterModule.forRoot() or RouterModule.forChild().

Another approach to deal with routes: we could dynamically add route configuration into Router, which is equivalent to using ROUTES provider. However all the routable components have to be declared in entryComponent or using ANALYZE_FOR_ENTRY_COMPONENTS. See more details in Router.md.

As shown above, the both ROUTES and ANALYZE_FOR_ENTRY_COMPONENTS are tokens for provider declaration, which should get merged as root providers available for all application. However if it is declared in lazy loaded modules, it is only available within its module, as the behavior of any lazy loaded modules.

# **How to create dynamic content (literature survey and summery)**
There are two types of views which can be created dynamically: 
1. Embedded views created from ng-template;
2. Hosted views created from Components;

There are also several ways of creating dynamic view from using low to high level api.

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

    createComponent(componentFactory, index, injector...): ComponentRef<C>
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
A common pattern developed in Angular Material (CDK) to ease the process of dynamically create views. Portal/PortalOutlet further abstract portal concept out of embedded view and host view. The PortalOutlet can attach any Portal, either TemplatePortal or ComponentPortal. A PortalOutlet can be created out of any DOM element using query selector (DomPortalOutlent). Directive on ng-template to create a PortalHost. cdkPortal and CdkPortalOutlet directives are the helpers to make port and portalOutlet declarative, and are Portal and PortalOutlet themselves respectively.

```
@Component({
  selector: 'app-crop-tool',
   template: `
        <ng-content [CdkPortalOutlet]="optionsPortal"></ng-content>
        <ng-template cdkPortal #optionsTmpl="cdkPortal">
          <div class="option-label">Basic Crop</div>
        </ng-template>
    `
})
export class CropToolComponent { 
  @ViewChild('optionsTmpl') optionsPortal: TemplatePortal<any>;

```
CdkPortalOutlet directive can create a PortalHost on the element applied, and accept an instance of portal. cdkPortal directive can be applied to a ng-template, which then can be queried using @ViewChild to return an instance of TemplatePortal.  
cdkPortal/CdkPortalOutlet further abstracts template/component difference out, comparing with ngTemplateOutlet and ngComponentOutlet.

### Dynamic component and injector:
When dynamically create a angular component, sometimes we need to pass some data to the component. Customized injector for the component is one of ways to pass data over to the component via DI.  
The ComponentFactory.create(injector: Injector, ...) provides a way to pass a customized injector to the new component.  
Normally the host component will have the injector injected, and then create a child injector from the host parent injector with customized providers using:    
Injector.create(providers: StaticProvider[], parentInjector)  

All the other higher level api(s) such as ViewContainerRef, ngComponentOutlet, and PortalOutlet for dynamic component creation expose the injector option.
Reference 8 shows an overlay example using customized injector to pass data to dynamic created component via DI in Portal/PortalOutlet environment. Material dialog uses the same method passing data to component shown in dialog window, I believe.

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
8. [CUSTOM OVERLAYS WITH ANGULAR'S CDK](https://blog.thoughtram.io/angular/2017/11/20/custom-overlays-with-angulars-cdk.html)
9. [CUSTOM OVERLAYS WITH ANGULAR'S CDK - PART 2](https://blog.thoughtram.io/angular/2017/11/27/custom-overlays-with-angulars-cdk-part-two.html)
10. [Angular2: Binding an observable to an immutable child component input.](http://almerosteyn.com/2016/03/immutable-component-input-from-observable)
11. [Entry Components of a Lazy Loaded NgModule are not available outside the Module #14324](https://github.com/angular/angular/issues/14324)  
A toolbar example dynamically add components embedded in lazy loaded module. And also a feature request for angular.
