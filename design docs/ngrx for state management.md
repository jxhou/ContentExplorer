ngrx 4.*

## Code structure
1. The application state is divided by modules. Each module defines a sub-state from the root state object along with composite reducer of the module.
2. All the sub-states of modules are stored in a flat tree structure no matter of the hierarchy of modules.

## **References**:
1. [ngrx github](https://github.com/ngrx/platform)
2. [ngrx example application](https://github.com/ngrx/platform/blob/master/example-app/README.md) and [live app](https://ngrx.github.io/platform/example-app/#/login).
3. [angular-ngrx-socket-frontend](https://github.com/avatsaev/angular-ngrx-socket-frontend)
4. [NgRx: Patterns and Techniques](https://blog.nrwl.io/ngrx-patterns-and-techniques-f46126e2b1e5) by Victor Savkin
5. [Using NgRx 4 to Manage State in Angular Applications](https://blog.nrwl.io/using-ngrx-4-to-manage-state-in-angular-applications-64e7a1f84b7b) by Victor Savkin
6. [Comprehensive Introduction to @ngrx/store](https://gist.github.com/btroncone/a6e4347326749f938510)
7. [Ultimate Angular’s new free NGRX store and effects course](https://ultimateangular.com/ngrx-store-effects?utm) The best online course on ngrx.  
[UltimateAngular/redux-store, github project](https://github.com/UltimateAngular/redux-store/tree/05-actions-action-creators): a pure redux-store implementation without any dependency, worth of reading.
[UltimateAngular/ngrx-store-effects-app, github project](https://github.com/UltimateAngular/ngrx-store-effects-app/tree/27-testing-effects). ngrx examples full of best practices, the best, so far.