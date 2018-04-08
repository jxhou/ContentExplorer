
https://blog.angularindepth.com/here-is-what-you-need-to-know-about-dynamic-components-in-angular-ac1e96167f9e

Each module provides a convenient service for all its components to get a component factory. This service is ComponentFactoryResolver. So, if you define a BComponent on the module and want to get a hold of its factory you can use this service from a component belonging to this module:
This only works if both components are defined in the same module or if a module with a resolved component factory is imported.

[What you always wanted to know about Angular Dependency Injection tree](https://blog.angularindepth.com/angular-dependency-injection-and-tree-shakeable-tokens-4588a8f70d5d)

[How to list / output all routes in @Routes in my Angular2 App](https://stackoverflow.com/questions/37569936/how-to-list-output-all-routes-in-routes-in-my-angular2-app)

example dynamically add routes via activatedRoute, however the routed component has to be added in entryComponent statically. plunker examples.
https://embed.plnkr.co/wBorFvoG3hfD36iOcNqu/

How to dynamically add components to NgModule in Angular 4 and @angular/cli?
https://stackoverflow.com/questions/44587938/how-to-dynamically-add-components-to-ngmodule-in-angular-4-and-angular-cli
add components to entryComponent

Load NgModule entryComponents dynamically using service
https://stackoverflow.com/questions/41200544/load-ngmodule-entrycomponents-dynamically-using-service?rq=1

ANALYZE_FOR_ENTRY_COMPONENTS 

Dynamically load components without breaking AoT - Angular2
https://stackoverflow.com/questions/42482917/dynamically-load-components-without-breaking-aot-angular2

How to provide routes dynamically at bootstrap?
https://stackoverflow.com/questions/39588633/how-to-provide-routes-dynamically-at-bootstrap

Understanding AOT and Dynamic Components
http://tutorials.indianjobs.co.in/2017/01/understanding-aot-and-dynamic-components.html
Example of how to use ANALYZE_FOR_ENTRY_COMPONENTS to add dynamic components to entryComponent property.

How to inject routes to external angular module
https://stackoverflow.com/questions/43494678/how-to-inject-routes-to-external-angular-module
Use provideRoutes to add routes.

How to manually lazy load a module?
https://stackoverflow.com/questions/40293240/how-to-manually-lazy-load-a-module
link to provideRoutes implementation in angular router_module.ts

## **References**:
[Routing & Navigation official doc](https://angular.io/guide/router)  
[Angular Router](https://vsavkin.com/angular-2-router-d9e30599f9ea) by savkin  
[Angular Router, Understanding Redirects](https://vsavkin.com/angular-router-understanding-redirects-2826177761fc) by savkin  
[Angular Router, Understanding Router State](https://vsavkin.com/angular-router-understanding-router-state-7b5b95a12eab) by savkin  
[Angular Router, Preloading Modules](https://vsavkin.com/angular-router-preloading-modules-ba3c75e424cb)  by savkin  
[Angular Router: Declarative Lazy Loading](https://vsavkin.com/angular-router-declarative-lazy-loading-7071d1f203ee) by savkin  
[Access parent Route params with Angular's Router](https://toddmotto.com/angular-parent-routing-params) by Todd  
[ Angular's Router: the Introduction](https://toddmotto.com/angular-component-router) by Todd  
[Angular Router: A Complete Example (build a Bootstrap Navigation Menu)](https://blog.angular-university.io/angular-2-router-nested-routes-and-nested-auxiliary-routes-build-a-menu-navigation-system/)  
[The 7-step process of Angular router navigation](https://www.jvandemo.com/the-7-step-process-of-angular-router-navigation/?utm_source=mybridge&utm_medium=blog&utm_campaign=read_more)   
The best discussion about router url composition. Good reference to go to when dissect/construct a route url.
[Our solution for getting a previous route with Angular 5](https://blog.hackages.io/our-solution-to-get-a-previous-route-with-angular-5-601c16621cf0)  
[Lazy Loading Angular - Code Splitting NgModules with Webpack](https://toddmotto.com/lazy-loading-angular-code-splitting-webpack)  
Show example how to eagerly load module using lazy load method.
[Angular: Understanding Modules and Services](https://medium.com/@michelestieven/organizing-angular-applications-f0510761d65a)  
Point out eagerly load a module configured in lazy loading is a better way than just using eagerly load format.
[Routing to sub routing module without lazy loading](https://stackoverflow.com/questions/45447069/routing-to-sub-routing-module-without-lazy-loading)  
Stackoverflow issue about eagerly load module with lazy format.  
[Entry Components of a Lazy Loaded NgModule are not available outside the Module #14324](https://github.com/angular/angular/issues/14324)


