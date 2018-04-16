# routing

## Summery
Angular routing is based on dynamic component creation (see more detailed discussion in DynamicContent.md). Any routed components are implicitly declared as entryComponent which will be compiled by Angular to generate componentFactory, which can then be used to dynamically create a component. The route declaration actually results in two provide declarations: ANALYZE_FOR_ENTRY_COMPONENTS, and ROUTES, the former of which is the provider for entryComponents, the later is the provider of routing tree.

There are two types of routes: eagerly loaded or lazy loaded.

1. Eagerly loaded modules are directly imported, while lazy loaded one is not imported at all, only referred using loadChildren.  

2. All the providers in all eagerly (direct/indirect) loaded modules are merged into root injector, so are available application wide. However all the providers declared or imported in lazy loaded modules are not available outside of the lazy module itself, although there is feature request mentioned in ref. 15 to address this issue. Therefore any entryComponent declared in lazy load modules is not available, and can not be dynamically created outside of its module.  

3. For eagerly loaded modules, RouterModule.forRoot, RouterModule.forChild() are used in root module and feature modules respectively. Except loading router related singleton providers, forRoot() basically does same thing as forChild() by calling provideRoutes(routes) as provider, which basically provide both ROUTES and ANALYZE_FOR_ENTRY_COMPONENTS tokens (see details in DynamicContent.md). ROUTES will add routes to router configuration, and ANALYZE_FOR_ENTRY_COMPONENTS will declare entryComponents, both of which take an object of type Routes.   

The routes declared by ROUTES token in either forRoot() or forChild() are refer to the root of router configuration. So a full path of routing is needed when configure a child route. So a root module and feature module independently add their routes to the router configuration using forRoot() or forChild(), if they are not related. However for nested parent/child routes, it is a common practice to write routing configure in parent component including nested child routes in one location to maintain the correct tree structure. The bad thing about this is that the parent component need to know all the details of routing in child components, when define the route configuration. Although one can configure nested routes in different modules, but one have to make sure to have right route path starting from root.  

However the lazy loaded module behave differently as show below:

4. Lazy load module maintains its own context starting from parent component. That means you can define route configuration in lazy loaded module using forChild() as itself as root. The routing tree is then appended to its parent routing tree after the module is lazy loaded. This way parent and child route configuration are completely isolated with each other. There is a common practice in lazy loaded module using a empty path for the host component in lazy loaded module, and define its children underneath it (see ref 12 for example). 

Obviously the lazy loaded module has a better route configuration setup. There is a trick to use the same route configuration setup for eagerly loaded module, which is a preferred way suggested in ref 13.

5. Eagerly load module using loadChildren (lazy format).
A module can also be loaded eagerly using lazy loading syntax in order to take advantage of the isolated, append-able sub-route tree (see ref 12, 13, and 14).
```

import { DashboardModule } from '../dashboard/dashboard.module';

export const ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', loadChildren: () => DashboardModule },
  {
    path: 'settings',
    loadChildren: '../settings/settings.module#SettingsModule',
  },
  { path: 'reports', loadChildren: '../reports/reports.module#ReportsModule' },
];

```
where DashboardModule is imported at the beginning, and `{ path: 'dashboard', loadChildren: () => DashboardModule },` in route configuration, while DashboardModule can define its own nested routes internally just like any lazy loaded module.

6. Add routes to route configuration programmatically.
Besides configure route using ROUTES token (which RouterModule.forRoot/forChild use internally), Router interface can be used to add routes to the configuration.

## Setting module implementation with dynamic routing

### Goal of settings page implementation
The settings page is designed to host setting pages from different modules. The settings page acts as a container for setting page from any module without any existing knowledge. When a new module with setting page is created, it should be able to add its setting page to settings container without changing the settings container.

### implementation 1: see dynamicSetting/v1 branch
setting.component.ts uses material tab control (<nav mat-tab-nav-bar>), which tab behavior using <router-outlet>.
The SettingsModule
src/app/settings/settings.module.ts
```
export class SettingsModule {
  static withRoutes(routes: Routes): ModuleWithProviders {
    return {
        ngModule: SettingsModule,
        providers: [
          provideRoutes(routes)
        ]
    }
  }

```
where withRoutes() static method takes a "routes" parameter, which contains dynamic components to be navigated in Routes format.

Check out app/routing/routing.module.ts to see how withRoutes() is invoked.  
Basically any module which want its setting component to display in settings container, just call SettingsModule.withRoutes(), which in turn call Angular's provideRoutes() to declare entryComponents and add routes to router configuration as discussed above.

The point here is to show how to use provideRoutes() to dynamic register routing components.

### implementation 2: 
The current implementation separates the entryComponents and router configuration registration.

The SettingsModule
src/app/settings/settings.module.ts

```
static withSettingRoutes(routes: Routes) {
    return {
      ngModule: SettingsModule,
      providers: [
        {
          provide: ANALYZE_FOR_ENTRY_COMPONENTS,
          useValue: routes, multi: true
        },
        {
          provide: SETTINGS_ROUTES,
          useValue: routes, multi: true
        },
      ]
    }
  }

```
withSettingRoutes() still takes routes, which is relative route, but could be just array of component types.  
 
Use ANALYZE_FOR_ENTRY_COMPONENTS token to register entry component, and use SETTINGS_ROUTES custom token to register a sub-routes, which then will be added dynamically to router configuration by settings.component.

Any module which expose it setting page can import SettingsModule.withSettingRoutes() to register its setting page.

src/app/settings/settings.component.ts
```
export class SettingsComponent implements OnInit {
  tabs: {label: string, link: string}[];

  constructor(private router: Router, private activatedRoute: ActivatedRoute, @Inject(SETTINGS_ROUTES) private settingRoutes: Routes[]) {
    // flatten array of Routes, and then dynamically add to current children
    activatedRoute.routeConfig.children = [].concat.apply([], settingRoutes);
    this.tabs = activatedRoute.routeConfig.children.map(child => {
      return {label: child.data.title, link: child.path};
    });
  }

  ngOnInit() {
  }
}

```
where SETTINGS_ROUTES is injected, and dynamically added to router configuration.  

However this solution only works with eagerly loaded modules. For the lazy loaded module, all the providers registered are only available whithin its module as discussed above.

### implementation 3: 
Allow lazy loaded module to contribute its setting page to settings container.
To be implemented, or wait till angular's support as discussed above.

## The related references for dynamic Setting components
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
1. [Routing & Navigation official doc](https://angular.io/guide/router)  
2. [Angular Router](https://vsavkin.com/angular-2-router-d9e30599f9ea) by savkin  
3. [Angular Router, Understanding Redirects](https://vsavkin.com/angular-router-understanding-redirects-2826177761fc) by savkin  
4. [Angular Router, Understanding Router State](https://vsavkin.com/angular-router-understanding-router-state-7b5b95a12eab) by savkin  
5. [Angular Router, Preloading Modules](https://vsavkin.com/angular-router-preloading-modules-ba3c75e424cb)  by savkin  
6. [Angular Router: Declarative Lazy Loading](https://vsavkin.com/angular-router-declarative-lazy-loading-7071d1f203ee) by savkin  
7. [Access parent Route params with Angular's Router](https://toddmotto.com/angular-parent-routing-params) by Todd  
8. [Angular's Router: the Introduction](https://toddmotto.com/angular-component-router) by Todd  
9. [Angular Router: A Complete Example (build a Bootstrap Navigation Menu)](https://blog.angular-university.io/angular-2-router-nested-routes-and-nested-auxiliary-routes-build-a-menu-navigation-system/)  
10. [The 7-step process of Angular router navigation](https://www.jvandemo.com/the-7-step-process-of-angular-router-navigation/?utm_source=mybridge&utm_medium=blog&utm_campaign=read_more)   
The best discussion about router url composition. Good reference to go to when dissect/construct a route url.
11. [Our solution for getting a previous route with Angular 5](https://blog.hackages.io/our-solution-to-get-a-previous-route-with-angular-5-601c16621cf0)  
12. [Lazy Loading Angular - Code Splitting NgModules with Webpack](https://toddmotto.com/lazy-loading-angular-code-splitting-webpack)  
Show example how to eagerly load module using lazy load method.
13. [Angular: Understanding Modules and Services](https://medium.com/@michelestieven/organizing-angular-applications-f0510761d65a)  
Point out eagerly load a module configured in lazy loading is a better way than just using eagerly load format.
14. [Routing to sub routing module without lazy loading](https://stackoverflow.com/questions/45447069/routing-to-sub-routing-module-without-lazy-loading)  
Stackoverflow issue about eagerly load module with lazy format.  
15. [Entry Components of a Lazy Loaded NgModule are not available outside the Module #14324](https://github.com/angular/angular/issues/14324)  
A toolbar example dynamically add components embedded in lazy loaded module.


