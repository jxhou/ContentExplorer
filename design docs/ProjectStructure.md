
## ES6's module, import, and export via Angular's ngModule, imports, and exports
Before discuss project structure, lay down some background information about ES6 module and angular module.  

ES6 has module with its import and export; while Angular has its ngModule with imports and exports (with plural s). ES6's module, import, and export are similar to Angular's ngModule, imports, and exports in concept. However they are complete different beasts. Those two sets of concepts could be quite confusing some times.

In ES6, one file can be a module, each module can import/export multiple types. import/export make types available between modules. While in Angular world, a ngModule can only imports ngModules, but can exports both imports(ed) ngModules and internal components, and plus expose services in 'providers' section. When a ngModule is imports(ed), it makes all the components directly and indirectly exports(ed) in the ngModule, and in the nested ngModules available in importing module; and also add the services defined in ngModule's 'providers', and services nested in imports(ed) ngModule to root DI injector.

When an eagerly loaded ngModule imports other ngModules with service exposed with 'provider', all the service providers are merged into root Di injector, making it available to entire application. Therefore in the scenario of eagerly loaded ngModules, the services exposed in ngModule's 'providers' section are always singleton, even related ngModules are imports(ed) in multiple locations, due to the fact that the providers are merged in root injector.  For non-singleton service, declare services in component's providers section. However for lazy loaded ngModules, the services declared in imported ngModule's providers section will not be merged in root DI injector, therefore create its own instance of service locally, even the lazy loaded ngModule can still access its parent injector. This behavior of lazy loaded ngModule can create problem if imports ngModule with service which suppose to be singleton. Therefore the ngModule with singleton service should only be imports(ed) in root component, not in lazy loaded modules, the lazy loaded modules will get access to the singleton service via parent injector.

There are solutions to address the singleton issue when lazy loaded ngModules may involve: such as singleton gurad, forRoot/forChild pattern, and "smart module" as decribed in Angularsingleton.md.  

In general, Angular's ngModel, imports, and exports are used on top of the ES6's module, import, and export. A ngModule type has to be ES6 import(ed) first, before it can be Angular 'imports(ed)'. As always in javascript world, a type has to be imported first before it can be referenced.

The type of injected services always need to be ES6 import(ed) in the file where it is referenced, while the services are loaded indirectly via ngModule imports some where up along the component tree.

Angular components are indirectly loaded via imports another ngModule in the host ngModule. However the loaded component type does not need to be ES import(ed) in the file where is referenced. The component is referenced using its html tag in ngTemplate, while angular compiler actually make the connection between the html tag and the component type.

## core and shared modules 
By convention, a project has core and shared modules. In general, core module single used, while shared module is multiple used. With core, shared, and feature modules, the app.module should be clean and small.

Considerations for core module:
1. Singleton services are hosted in core module.
2. Core module should be only imports(ed) in root module (app.module).
3. Singleton components can be also hosted in core module, which are used in app.component's template. Spinner, toaster, navigation components are good examples, if they are used as a global components.
4. use singleton guard to prevent multiple core instances as discussed in angular.io style guide or reference 1, or any other singleton tricks as described above.

Considerations for shared modules:
1. shared module is designed to be imports(ed) in multiple ngModules.
2. There should be no singleton service in shared module, although no-singleton service can be included in 'providers' section. 
3. shared module can be also used as barrel package to imports/exports all the common ngModules such as angular CommonModule, FormsModule, and material components if choose to use material component. And then all other ngModules in the project will just imports one shared module for simplicity.
4. Only dumb components are recommended in shared modules (?) to make shared module independent to the rest of application[1].

Considerations for feature module:
1. Try to create feature module which don’t depend on any other feature modules just on services provided by CoreModule and components provided by SharedModule. [1].
2. if a feature module need service from another feature module consider move the service to core module.


## **References**

1. [6 Best Practices & Pro Tips when using Angular CLI](https://medium.com/@tomastrajan/6-best-practices-pro-tips-for-angular-cli-better-developer-experience-7b328bc9db81)  
2. [Angular.io style guide](https://angular.io/guide/styleguide)