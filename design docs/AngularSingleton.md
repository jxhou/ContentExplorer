## Ensure singleton in angular, and How to use forRoot to expose modules with provider in SharedModule

With angular hierarchical DI injectors, service singleton is the default behavior (mainly with eagerly loaded modules). However for lazy loaded module, it is possible for the module to have its own instance of service instead of sharing one from root [see reference 2, 3].

To ensure the singleton of a service, I have seen two solutions: forRoot/forChild pattern

Follow is an example from angular material2, whose submodules implement forRoot pattern, and special provider configuration:

## forRoot/forChild pattern
```
import {NgModule, ModuleWithProviders} from '@angular/core';
import {MdButtonModule} from './button/index';
import {MdDialogModule} from './dialog/index';
import {MdAutocompleteModule} from './autocomplete/index';
...

const MATERIAL_MODULES = [
  MdAutocompleteModule,
  MdButtonModule,
  MdDialogModule,
  ...
];

/** @deprecated */
@NgModule({
  imports: [
    MdAutocompleteModule.forRoot(),
    MdButtonModule.forRoot(),
    MdDialogModule.forRoot(),
    ...
  ],
  exports: MATERIAL_MODULES,
})
export class MaterialRootModule { }

/** @deprecated */
@NgModule({
  imports: MATERIAL_MODULES,
  exports: MATERIAL_MODULES,
})
export class MaterialModule {
  /** @deprecated */
  static forRoot(): ModuleWithProviders {
    return {ngModule: MaterialRootModule};
  }
}
```

## Special provider configuration (smart module)

There is a new way to deal with the singleton issue of a service provider other than forRoot/child pattern.

https://stackoverflow.com/questions/44532307/why-was-forroot-removed-from-material2-and-what-can-i-do-about-in-regards-to-l


The forRoot() methods have been removed because the Angular Material team found a new solution to ensure that a given provider is a singleton.

Before a provider in Material is created, there is a provider factory that checks if there is already an instance of the given provider.

If the factory found an ancestor provider it uses the existing one. And if there is no similar provider instantiated already it will just create a new instance.

An official proposal has been submitted on the Angular repository: https://github.com/angular/angular/issues/13854

Here is a link to one example provider factory of Angular Material: 
https://github.com/angular/material2/blob/master/src/cdk/a11y/live-announcer.ts

live-announcer.ts

```
@Injectable()
export class LiveAnnouncer implements OnDestroy {
  private _liveElement: Element;
  ...
}

/** @docs-private */
export function LIVE_ANNOUNCER_PROVIDER_FACTORY(
    parentDispatcher: LiveAnnouncer, liveElement: any, platform: Platform) {
  return parentDispatcher || new LiveAnnouncer(liveElement, platform);
}

/** @docs-private */
export const LIVE_ANNOUNCER_PROVIDER = {
  // If there is already a LiveAnnouncer available, use that. Otherwise, provide a new one.
  provide: LiveAnnouncer,
  deps: [
    [new Optional(), new SkipSelf(), LiveAnnouncer],
    ...
  ],
  useFactory: LIVE_ANNOUNCER_PROVIDER_FACTORY
};

```
public_api.ts

```
@NgModule({
  imports: [CommonModule, PlatformModule],
  declarations: [FocusTrapDirective, FocusTrapDeprecatedDirective],
  exports: [FocusTrapDirective, FocusTrapDeprecatedDirective],
  providers: [InteractivityChecker, FocusTrapFactory, LIVE_ANNOUNCER_PROVIDER]
})
export class A11yModule {}
```
Here LiveAnnouncer provider is defined.   

'deps:' [] says: the dependency is optional (new Optional()), will return null, if cannot be resolved; do not resolve the dependency from local provider (new SkipSelf()), but from parent; LiveAnnouncer has dependency on itself.

The end result is that the LiveAnnouncer factory will be injected with another instance of LiveAnnouncer, which is resolved from the parent injector (not current injector). In the case of lazy loading module, the resolved LiveAnnouncer reference is from parent injector, if parent already has an instance. This solves the singleton problem facing lazy loading using special configuration of provider without using forRoot pattern.

The LIVE_ANNOUNCER_PROVIDER_FACTORY implementation is straight forward, which receives an instance of LiveAnnouncer resolved from parent injector as specified in "deps" above, return the parentDispatcher, or create new instance if parentDispatcher is null.

There is still a shortcoming of this solution: if there are two lazy loading modules depending on a same service, while root module does not import the service, it will end up with each lazy loaded module resolved to its own instance of service, breaking the singleton usage.

A similar trick is used to detect a undesired behavior of importing certain module such as CoreModule multiple times using @Optional() @SkipSelf() decorators. See more details in core.module.ts and module-import-guard.ts

## The new provider mechanism since angular 6: “Tree-shakable providers”
A way to configure provider:
```
providedIn: 'root' | SomeModule
```
The Tree-shakable providers defined in ngModule do not to be (ng) imports(ed) like ones configured in ngModule's providers: []. One can simply (js) import the type, and declare it in class's constructor, the service will be magically injected.
See more details in [5] about the pros and cons for provider configurations.

## **References**:
1. [My NgModule Summaries](https://jxhou.wordpress.com/2016/12/25/ngmodule/)
2. [Avoiding common confusions with modules in Angular](https://blog.angularindepth.com/avoiding-common-confusions-with-modules-in-angular-ada070e6891f) by Maxim Koretskyi
3. [Shared Modules In Angular Apps: Providers Best Practices And What Does `forRoot()` Do?](https://www.gurustop.net/blog/2017/02/14/shared-modules-in-angular-apps-providers-best-practices-and-what-does-forroot-do/)
4. [Understanding Angular modules (NgModule) and their scopes](https://medium.com/@cyrilletuzi/understanding-angular-modules-ngmodule-and-their-scopes-81e4ed6f7407)
5. [Total Guide To Angular 6+ Dependency Injection — providedIn vs providers:[ ]](https://medium.com/@tomastrajan/total-guide-to-angular-6-dependency-injection-providedin-vs-providers-85b7a347b59f) Summarize the provider configurations