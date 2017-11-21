
## ES6's module, import, and export via Angular's ngModule, imports, and exports
Before discuss project structure, lay down some background information about ES6 module and angular module.  

ES6 has module with its import and export; while Angular has its ngModule with imports and exports (pay attention to plural s). ES6's module, import, and export are similar to Angular's ngModule, imports, and exports in concept. However they are complete different beasts. Those two sets of concepts could be quite confusing some times.

In ES6, one file can be a module, each module can import/export multiple types. import/export make types available between modules. While in Angular world, a ngModule can only imports ngModules, but can exports both imports(ed) ngModules and internal components, and plus expose services in 'providers' . When a ngModule is imports(ed), it makes all the components directly exports(ed), and indirectly exports(ed) nested in exports(ed) ngModules available in importing module; and also add the services defined in 'providers', and services nested in imports(ed) ngModule to root DI injector.

In general, Angular's ngModel, imports, and exports are used on top of the ES6's module, import, and export. When Angular 'imports' a symbol/type, the same type has to be ES6 import(ed) as well.  

The type of injected services always need to be ES6 import(ed), while the services are ng imports(ed) some where along up the component tree.

With Angular imports(ed) module, the exported component type does not need to be ES import(ed). The component is used as html tag in ngTemplate.

## core and shared modules 
By convention, a project has core and shared modules. In general, core module single used, while shared module is multiple used.

Considerations for core module:
1. Singleton services are hosted in core module.
2. Core module should be only imports(ed) in root module (app.module).
3. Singleton components can be also hosted in core module, which are used in app.component's template. Spinner, toaster, navigation components are good examples, if they are used as a global components.
4. use singleton guard to prevent multiple core instances as discussed in angular.io style guide or reference 1. It makes no difference, when 'imports' core module in multiple eagerly loaded ngModules, because all are mapped to a single provider in root DI injector. Multiple core instances may be created if core module is imports(ed) by lazy loaded module.
5. See tricks to ensure singleton in Angularsingleton.md

Considerations for shared modules:
1. shared module is designed to be imports(ed) in multiple ngModules.
2. There should be no singleton service in shared module, although no-singleton service can be included in 'providers' section. 
3. shared module can be also used as barrel package to imports/exports all the common ngModules such as angular CommonModule, FormsModule, and material components if choose to use material component. And then all other ngModules in the project will just imports one shared module for simplicity.
4. Only dumb components are recommended in shared modules (?) to make shared module independent to the rest of application[1].

Considerations for feature module:
1. Try to create feature module which don’t depend on any other feature modules just on services provided by CoreModule and components provided by SharedModule. [1].
2. if a feature module need service from another feature module consider move the service to core module.


## **References**:

1 [6 Best Practices & Pro Tips when using Angular CLI](https://medium.com/@tomastrajan/6-best-practices-pro-tips-for-angular-cli-better-developer-experience-7b328bc9db81)