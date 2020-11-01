# routing

## Summery
Angular routing is based on dynamic component creation (see more detailed discussion in DynamicContent.md). Any routed components are implicitly declared as entryComponents which will be compiled by Angular to generate componentFactory, which can then be used to dynamically create a component. The route declaration actually results in two provider declarations: ANALYZE_FOR_ENTRY_COMPONENTS, and ROUTES, the former of which is the provider for entryComponents (declaring route components as entryComponents), the later is the provider of routing tree (adding components to the route tree). Both RouterModule.forRoot() and RouterModule.forChild() actually declare those two providers along with importing RouterModule.

Notes: 10/24/2020
The entryComponent declaration is obsolete since angular 9+ (Ivy render engine). Therefore ANALYZE_FOR_ENTRY_COMPONENTS probably has been dropped in route declaration.


There are two types of routes: eagerly loaded or lazy loaded.

1. Eagerly loaded modules are directly imported, while lazy loaded one is not imported at all, only referred using loadChildren.  

2. All the providers in all eagerly (direct/indirect) loaded modules are merged into root injector, so are available application wide. However all the providers declared or imported in lazy loaded modules are not available outside of the lazy module itself, although there is feature request mentioned in ref. 15 to address this issue. Therefore any entryComponent declared in lazy load modules is not available, and can not be dynamically created outside of its module.  

Note: 10/24/20202
With Angular 9+ (Ivy), entryComponent declaration is not required any more. As long as the you get a reference to the type of a component, you should be able to create it dynamically outside of the lazy loaded module. See setting implementation for details in DynamicContent.md.

* 3. For eagerly loaded modules, RouterModule.forRoot(), RouterModule.forChild() are used in root module and feature modules respectively. Except loading router related singleton providers, forRoot() basically does same thing as forChild() by calling provideRoutes(routes) to define providers, which basically provide both ROUTES and ANALYZE_FOR_ENTRY_COMPONENTS tokens (see details in DynamicContent.md). ROUTES will add routes to router configuration, and ANALYZE_FOR_ENTRY_COMPONENTS will declare entryComponents, both of which take an object of type Routes.   

The routes declared by ROUTES token in either forRoot() or forChild() are referred to the root of router configuration. So a full path of routing is needed when configure a child route. So both root module and feature module independently add their routes to the router configuration using forRoot() or forChild(), if they are not related (not parent-children routes). However for nested parent/child routes, it is a common practice to write routing configure in parent component including nested child routes in one location to maintain the correct tree structure. The bad thing about this is that the parent component need to know all the details of routing in child components, when define the route configuration. It is not too bad, if the nested parent-child routes are in a same module. But if nested routes involve multiple modules, it introduce too much coupling. Although one can configure nested routes in different child modules, but one have to make sure to have right route path starting from root, which unnecessarily makes child module know its parent. 

However the lazy loaded module behaves differently as show below:

4. Lazy load module maintains its own context starting from parent component. That means you can define route configuration in lazy loaded module using forChild(), treating itself as root. The routing tree is then appended to its parent routing tree after the module is lazy loaded. In this way, the route configurations in parent and child modules are completely isolated with each other. It is a common practice in lazy loaded module to use a empty path for the host component in lazy loaded module, and define its children underneath it (see ref 12 for example). 

// app.module.ts
export const ROUTES: Routes = [
  { path: 'reports', loadChildren: '../reports/reports.module#ReportsModule' },
];

// reports.module.ts
export const ROUTES: Routes = [
  { path: '', component: ReportsComponent }
];

This module (reports.module) can then be used together with loadChildren and path in a parent module, letting AppModule dictate the URL. This creates a flexible module structure where your feature modules such as reports.module are “unaware” of their absolute path, they become relative paths based on the AppModule paths.

Obviously the lazy loaded module has a better route configuration setup. There is a trick to use the same route configuration setup for eagerly loaded module, which is a preferred way suggested in ref 12, 14.

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
where DashboardModule is imported at the beginning, and `{ path: 'dashboard', loadChildren: () => DashboardModule },` in route configuration, while DashboardModule can define its own nested routes internally just like any lazy loaded module.  'settings' and 'report' are real lazy loading modules.

See also the same implementation of this app
  path: 'EagerlyLoaded',
in \ContentExplorer\src\app\routing\app.route.ts

6. Add routes to route configuration programmatically.
Besides configuring route using ROUTES token (which RouterModule.forRoot/forChild use internally), Router interface can be used to add routes to the configuration, which is what used in settings page implementation below.

## Settings module implementation with dynamic routing

### Goal of settings page implementation
The settings page is designed to host setting pages from different modules. The settings page acts as a container for setting pages from any module without any existing knowledge. Whenever we create a new module, we can also create a setting's page. Then we can register with the settings container the setting's page, which will surface in the setting's container.

### implementation 1: see dynamicSetting/v1 branch
setting.component.ts uses material tab control (<nav mat-tab-nav-bar>), with its own children routing using an embedded <router-outlet>.

In this implementation, SettingsModule expose a method (withRoutes) to register a list of routes for setting's pages.

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
where withRoutes() static method takes a "routes" parameter, which contains dynamic components to be navigated in Routes format. The SettingsModule.withRoutes() is equivalent to Angular's RouterModule.forChild(). 

Check out app/routing/routing.module.ts to see how withRoutes() is invoked.  
Basically any module which want its setting component to display in settings container, just call SettingsModule.withRoutes(), which in turn call Angular's provideRoutes() to declare entryComponents and add routes to router configuration as discussed above. However the default Angular's provideRoutes() requires a configuration with full path of route, which is against the design goal of decoupled and plugin fashion. 

The point here is to show how to use provideRoutes() to dynamically register routing components, which can be replaced by just calling RouterModule.forChild().

To avoid the drawback of the absolute route path, we have the next implementation.

### implementation 2: 
This implementation separates the entryComponents and router configuration registration.
Also with this implementation, the "routes" are relative route path without parent information.

Here the routes are not registered with Angular Router yet, but register a provider for the custom SETTINGS_ROUTES token. The SettingModule will be injected with the SETTINGS_ROUTES, and the programmatically register the routes.

Note: 10/26/2020. entryComponents is deprecated since v9+. ANALYZE_FOR_ENTRY_COMPONENTS provide is not needed any more.


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
 
Use ANALYZE_FOR_ENTRY_COMPONENTS token to register entry component, and use SETTINGS_ROUTES custom token to register a sub-routes, which then will be added dynamically to router configuration by settings.component using router api. The SETTINGS_ROUTES = new InjectionToken<Routes>('settings.routes') is newly defined multi value token, allowing any component to provide its routes.

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

However this solution only works with eagerly loaded modules. For the lazy loaded module, all the providers registered are only available within its module as discussed above.

When a module want to register a setting page with SettingsModule, it imports SettingsModule by invoking SettingsModule.withSettingRoutes(), which actually declares entryComponents and SETTINGS_ROUTES providers in its own module, which are not available outside of this modules if it is lazy-loaded one. This does not import anything from SettingsModule, but uses its helper function to declare needed providers for routes. So a module with its setting page could just declare ANALYZE_FOR_ENTRY_COMPONENTS, and SETTINGS_ROUTES providers in its own module.

### implementation 3: 
Allow lazy loaded module to contribute its setting page to settings container.
The implementation 2, both ANALYZE_FOR_ENTRY_COMPONENTS, and SETTINGS_ROUTES providers are declared in a module with setting page. If the module is eagerly loaded, all the providers are available to entire application. However if lazy-loaded, all the providers declared are only available within the lazy-module. This makes the entry-component not aware to the root injector, and further cannot resolve the component factories for the setting page. Also the SETTINGS_ROUTES cannot be seen by SettingsModule either.

Ref 15 shows an example to dynamically create an instance of component defined in lazy loaded module from outside of lazy loaded module. The idea is to pass the componentFactoryResolver and injector from within the lazy loaded module to external service. Then the componentFactoryResolver and injector can be used outside of lazy loaded module to dynamically create the component.

However in my case, I do not create the component directly but via router. I still could not customize router to use the above trick.

Ref 17 outlines another manual lazy loading module using SystemJsNgModuleLoader, which could be used as my own method of lazy loading module. Then expose its setting's page from there. More details in DynamicContent.md.

Ref 18 propose the best solution for (Ref 15) the availability of entry components defined in a lazy loaded module so far, along with github project os sample implementation. This solution monkey patch root ComponentFactoryResolver to search component factories in lazy loaded local ComponentFactoryResolvers as well, which is transparent to any dynamic component creation. With the patched root ComponentFactoryResolver, any module in the app can dynamically create a component from any module including lazy loaded module magically.

Below is a brief description about the solution from the author, Jon Rimmer:

------------
I don't think any workaround is viable if it requires the code you're integrating with to know about it, because there's plenty of 3rd party code that just uses ComponentFactoryResolver without knowing about your special alternative registry.

With that in mind, here's my "solution": CoalescingComponentFactoryResolver. This is a service that should be provided by the app module and initialised in its constructor, like so:

```
@NgModule({
 providers: [CoalescingComponentFactoryResolver]
})
class AppModule {
  constructor(coalescingResolver: CoalescingComponentFactoryResolver) {
    coalescingResolver.init();
  }
}
Then, lazy-loaded modules should inject it and register their own ComponentFactoryResolver instances with it. Like so:

@NgModule({})
export class LazyModule {
  constructor(
    coalescingResolver: CoalescingComponentFactoryResolver,
    localResolver: ComponentFactoryResolver
  ) {
    coalescingResolver.registerResolver(localResolver);
  }
}
```

When this is done, entry components in the lazy-loaded module should be available from non-lazy loaded services.

How it works: When initialised, it injects the root app's ComponentFactoryResolver and monkey patches the resolveComponentFactory method to call its own implementation. This implementation first tries resolving the component factory on all the registered lazy-module resolvers, then falls back to the root app resolver (there's a bit of extra logic to avoid cyclic calls, but that's the gist).

So, yeah, a pretty gross hack. But it works, right now, in Angular 7. Maybe it will be of use to someone.
------------------

The implementation of dynamic setting's pages based on the ref 8 (CoalescingComponentFactoryResolver) CoalescingComponentFactoryResolver actually makes the provider of ENTRY_COMPONENTS declared in the lazy loaded module available to all the modules outside of the lazy loaded one. Therefore one should be able to create a component from lazy loaded module using standard component factory method. However in my previous implementation, I also use SETTINGS_ROUTES provider to pass route information to setting page host. But CoalescingComponentFactoryResolver can not help with SETTINGS_ROUTES provider. So create a new service of setting-host.service  in settings module:
C:\Users\jxhou_000\Documents\GitHub\ContentExplorer\src\app\settings\setting-host.service.ts

So every lazy loade module can call:
```
SettingHostService.addSettingRoute(route)
```
to register itself with settings module

In nutshell, every lazy loaded module should inject both CoalescingComponentFactoryResolver and settingHostService, and then call:
```
  coalescingResolver.registerResolver(localResolver);
  settingHostService.addSettingRoute(setting);
```
to register its ComponentFactoryResolver and setting page route.

See detailed implementation from:
C:\Users\jxhou_000\Documents\GitHub\ContentExplorer\src\app\lazy-loaded\lazy-loaded.module.ts
which shows an example of lazy loaded module with its setting page which will be dynamically added to settings host.

This implementation is based on monkey patching ComponentFactoryResolver. A similar way can also be implemented by patching injector. Actually ComponentFactoryResolver is retrieved from injector.

The solution is good with angular 8 (before ivy). However coalescingResolver trick might not be needed any more when ivy is out (angular 9 and later). The ivy may make entry component declaration obsolete. Before ivy, angular compiler has to create component factory in a separate file based on the declaration of entry component. With ivy, the component factory is embedded inside of component definition. If you have a component type, you should be able to create it without relying on a component factory define some where else. That means that when ivy is available, the dynamic setting page should work without coalescingResolver.

### implementation 4 with Ivy > v9.0.0: 
With Ivy (angular 9.0.0 +), component declared within a lazy loaded module can be dynamically created outside of the lazy module without any tricks as discussed above. Also the dynamic components do not need to be declared as entry component. This can be applied to all scenarios based on dynamic component creation, such as dialog displayed component, and routing components.

This behavior probably is due to that Ivy does not generate a separate ng_factory file anymore, but inline the factory information as a static field such as ngComponentDef inside of the component def after compiling. Before Ivy, component factory of dynamic components are declared as ANALYZE_FOR_ENTRY_COMPONENTS providers. With Ivy, the component factory info is embedded within component definition. Once you have a component type, you should be able to get hold of its factory and create an instance of it.

The new behavior is due to that Ivy does not separate component and its factory def any more, so does not rely on ENTRY_COMPONENT provider any more.

It probably still the case that any providers declared in a lazy-loaded module are local, and not available to modules outside of the lazy module.

After upgrade to v9+ with Ivy,  coalescingResolver can be removed completely.

Currently, eagerly loaded modules will register their setting's pages by calling SettingsModule.withSettingRoutes(SETTING_CHILD_ROUTES), and lazy loaded modules will use settingHostService to register its setting's page. There are total 4 setting pages: 3 from eagerly loaded modules, and one from lazy loaded module:

AppModule registers two setting pages; theme and test;

`
export const SETTING_CHILD_ROUTES: Routes =
[
  {
    path: 'theme',
    component: ThemeSettingsComponent,
    data: {
      title: 'theme'
    },
  },
  {
    path: 'test',
    component: TestSettingComponent,
    data: {
      title: 'test'
    },
  }
]
`

TestModuleModule registers its own setting's page by calling SettingsModule.withSettingRoutes(routes).
`
const routes: Routes = [
  {
    path: 'TestModuleSetting',
    component: TestModuleSettingComponent,
    data: {
      title: 'TestModuleSetting'
    },
  },
]
`


## Overall Routing implementation in this project
AppComponent
    AppLayoutComponent (\src\app\containers\app-layout\app-layout.component.ts)
      LayoutComponent (E:\src\app\shared\layout\containers\layout\layout.component.ts)
        |----<router-outlet></router-outlet>
        |----DashboardComponent
        |----LazyLoadedModule
        |----WithChildRoutesModule  (eagerly loaded module using lazy loading format)
               |-----<router-outlet></router-outlet>
               |----Child1Component
               |----Child2Component
        |----SettingsComponent
               |-----<router-outlet></router-outlet>
               |-----setting's page 1 from feature module 1
               |    ....
               |-----setting's page n from feature moudle n 

Each module with setting's page can register their setting's page with SettingsComponent.


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
16. [Angular Routing — A Better Pattern For Large Scale Apps](https://medium.com/@shairez/angular-routing-a-better-pattern-for-large-scale-apps-f2890c952a18)
17. [How to manually lazy load a module?](https://stackoverflow.com/questions/40293240/how-to-manually-lazy-load-a-module) use SystemJsNgModuleLoader to lazy load a module without router. https://github.com/alexzuza/angular-cli-lazy, example project.
18. [Coalescing Component Factory Resolver](https://github.com/jonrimmer/angular-coalescing-component-factory-resolver)