## ES6's module, import, and export via Angular's ngModule, imports, and exports
Before discuss project structure, lay down some background information about ES6 module and angular module.  

ES6 has module with its import and export; while Angular has its ngModule with imports and exports (with plural s). ES6's module, import, and export are similar to Angular's ngModule, imports, and exports in concept. However they are complete different beasts. Those two sets of concepts could be quite confusing some times.

In ES6, one file can be a module, each module can import/export multiple types. import/export make types available between modules. While in Angular world, a ngModule can only imports other ngModules, but can exports both imports(ed) ngModules and internal components, and plus expose services in 'providers' section. When a ngModule is imports(ed), it makes all the components exports(ed) in the ngModule available in importing module, which includes directly exports(ed) components, and components from re-exports(ed) ngModules; and also add the services defined in the ngModule's 'providers', and services nested in imports(ed) ngModule to root DI injector.

When an eagerly loaded ngModule imports other ngModules with service exposed with 'provider', all the service providers are merged into root Di injector, making it available to entire application. Therefore in the scenario of eagerly loaded ngModules, the services exposed in ngModule's 'providers' section are always singleton, even related ngModules are imports(ed) in multiple locations, due to the fact that the providers are merged in root injector.  For non-singleton service, declare services in component's providers section. However for lazy loaded ngModules, the services declared in imported ngModule's providers section will not be merged in root DI injector, therefore create its own instance of service locally, even the lazy loaded ngModule can still access its parent injector. This behavior of lazy loaded ngModule can create problem if imports ngModule with service which suppose to be singleton. Therefore the ngModule with singleton service should only be imports(ed) in root component, not in lazy loaded modules, the lazy loaded modules will get access to the singleton service via parent injector.

There are solutions to address the singleton issue when lazy loaded ngModules may involve: such as singleton gurad, forRoot/forChild pattern, and "smart module" as decribed in Angularsingleton.md.  

In general, Angular's ngModel, imports, and exports are used on top of the ES6's module, import, and export. A ngModule type has to be ES6 import(ed) first, before it can be Angular 'imports(ed)'. As always in javascript world, a type has to be imported first before it can be referenced.

The type of injected services always need to be ES6 import(ed) in the file where it is referenced, while the services are loaded indirectly via ngModule imports some where up along the component tree.

Angular components can be either indirectly loaded via imports another ngModule in the host ngModule, or implemented and declared (declaration section) in current/host ngModule. However the loaded component type does not need to be ES import(ed) in the file where is referenced, if it is used as html tags in component's ngTemplate, while angular compiler actually make the connection between the html tag and the component type. However if a component is dynamically instantiated, the component type has to be ES6 imported before referencing of course, and also added in entryComponents list from the host ngModule. 

See also AngularSingleton.md for more about new tree-shakable provider, which does not need 'imports' the hosting ngModule.

## Architecture - Layers (ref. 6)
The architecture describes two layers: Components Layer and Services Layer:

Components Layer encapsulates components which present the current application state. Components are separated into Smart and Dumb Components. The only logic present is view logic inside Smart Components.

Services Layer is more or less what we call 'business logic layer' on the server side. The layer defines the applications state, the transitions between state and classic business logic. Stores contain application state over time to which Smart Components subscribe to. Adapters are used to perform XHRs, WebSocket connections, etc. The business model is described inside the module. Use case services perform business logic needed for use cases. A use case services interacts with the store and adapters. Methods of use case services are the API for Smart Components. Those methods are Actions in reactive terminology.

## Smart and Dumb Components (ref.6)
The architecture applies the concept of Smart and Dumb Components (syn. Containers and Presenters). The concept means that components are divided into Smart and Dumb Components.

A Smart Component typically is a toplevel dialog inside the component tree.

- a component, that can be routed to
- a modal dialog
- a component, which is placed inside AppComponent

A Dumb Component can be used by one to many Smart Components. Inside the component tree a Dumb Component is a child of a Smart Component.

## Angular Modules
There are feature modules and special modules described by the Angular Styleguide - core and shared.

## core and shared modules 
By convention, a project has core and shared modules. In general, core module single used, while shared module is multiple used. With core, shared, and feature modules, the app.module should be clean and small.

A feature module is basically a vertical cut through both layers (component and service). The shared module consists of components shared across feature modules. The core module holds services shared across modules. So core module is a module only having a services layer and shared module is a module only having a components layer.

Considerations for core module:
1. Singleton services are hosted in core module.
2. Core module should be only imports(ed) in root module (app.module).
3. Singleton components can be also hosted in core module, which are used in app.component's template [4]. Spinner, toaster, navigation components are good examples[2], if they are used as a global components. Also the components fired up by singleton services are also good candidates [5].
4. use singleton guard to prevent multiple core instances [1, 2].
5. Use forRoot pattern in Core [4]. Or smart ngModule used in Angular material implementation.

Considerations for shared modules:
1. shared module is designed to be imports(ed) in multiple ngModules.
2. There should be no singleton service in shared module, although no-singleton service can be included in 'providers' section. 
3. shared module can be also used as barrel package to imports/exports all the common ngModules such as angular CommonModule, FormsModule, and material components if choose to use material component. And then all other ngModules in the project will just imports one shared module for simplicity.
4. Only dumb components are recommended in shared modules (?) to make shared module independent to the rest of application[1].

Considerations for feature module:
1. Try to create feature module which don’t depend on any other feature modules just on services provided by CoreModule and components provided by SharedModule. [1].
2. if a feature module need service from another feature module consider move the service to core module.

## File Structure (ref. 6)
### Toplevel
 /src
    └── /app
        ├── /account-management
        ├── /billing
        ├── /booking
        ├── /core
        ├── /shared
        ├── /status
        |
        ├── app.module.ts
        ├── app.component.spec.ts
        ├── app.component.ts
        └── app.routing-module.ts
### Feature Modules
A feature module contains the modules definition and two folders representing both layers.
  /src
    └── /app
        └── /account-management
            ├── /components
            ├── /services
            |
            ├── account-management.module.ts
            ├── account-management.component.spec.ts
            ├── account-management.component.ts
            └── account-management.routing-module.ts
### Components Layer      
Listing 3. Components layer file structure shows Smart Components on toplevel
    /src
    └── /app
        └── /account-management
            └── /components
                ├── /account-overview
                ├── /confirm-modal
                ├── /create-account
                ├── /forgot-password
                └── /shared
Listing 4. Smart components contain Dumb components
    /src
    └── /app
        └── /account-management
            └── /components
                └── /account-overview
                    ├── /user-info-panel
                    |   ├── /address-tab
                    |   ├── /last-activities-tab
                    |   |
                    |   ├── user-info-panel.component.html
                    |   ├── user-info-panel.component.scss
                    |   ├── user-info-panel.component.spec.ts
                    |   └── user-info-panel.component.ts
                    |
                    ├── /user-header
                    ├── /user-toolbar
                    |
                    ├── account-overview.component.html
                    ├── account-overview.component.scss
                    ├── account-overview.component.spec.ts
                    └── account-overview.component.ts

 If a Dumb Component is used by multiple Smart Components inside the components layer it is put inside the /shared folder inside the components layer. 
 
 With this way of thinking the shared module makes a lot of sense. If a Dumb Component is used by multiple Smart Components from different feature modules, the Dumb Component is placed into the shared module.

   /src
    └── /app
        └── /shared
            └── /user-panel
                |
                ├── user-panel.component.html
                ├── user-panel.component.scss
                ├── user-panel.component.spec.ts
                └── user-panel.component.ts

## **References**
1. [6 Best Practices & Pro Tips when using Angular CLI](https://medium.com/@tomastrajan/6-best-practices-pro-tips-for-angular-cli-better-developer-experience-7b328bc9db81)  
2. [Angular.io style guide](https://angular.io/guide/styleguide)
3. github project: [tomastrajan/angular-ngrx-material-starter](https://github.com/tomastrajan/angular-ngrx-material-starter) 
4. [ngrx open source and demo-example](https://github.com/ngrx/platform)
5. [rwa-trivia github project](https://github.com/anihalaney/rwa-trivia) 
6. [devon4ng/documentation](https://github.com/devonfw/devon4ng/tree/develop/documentation)