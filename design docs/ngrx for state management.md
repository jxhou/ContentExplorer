ngrx 4.*

## Code folder structure
1. The application state is divided by modules. Each module defines a sub-state of the root app state along with composite reducer of the module. Each module can has its own sub-states based on contained features to form a state tree of the module.
2. Each module will register its own reducer/reducer map with the store using StoreModule.forFeature(moduleName, routerReducer); and select the sub-states using createFeatureSelector(moduleName). Make sure the moduleName used are same, when register and retrieve. 
All the sub-states of modules are stored in a flat tree structure keyed by its module name, no matter of the hierarchy of modules in an app.
3. Code structure for module:
If a angular module participates ngrx state management, it should have a 'store' folder with following structure:
```
    store--
      actions--
        a.action.ts
        b.action.ts
        ...
        index.ts
      effects--
        a.effect.ts
        b.effect.ts
        ...
        index.ts
      reducers--
        a.reducer.ts
        b.reducer.ts
        ...
        index.ts
      selectors
        a.selectors.ts
        b.selectors.ts
        ...
        index.ts
      index.ts

```
All modules including the root app.module, core.module, and feature modules can have this folder structure. The barrel index.ts files are used to roll up all the exports.  

Each module can have multiple sub-module states.   

The selectors can be defined in each *.reducer.ts, or in a separate *.selectors.ts file residing in selectors folder if complicated selector composition is needed. The basic selectors are still defined in *.reducer.ts, while composite selectors using createSelector() utility are defined in *.selectors.ts.

4. reducer content:
Each *.reducer.ts file define a sub-module state interface, and an initial state for the sub-module along with reducer function.  Basic element selectors of the state are also defined.

Best practice for reducer function: Each reducer function should have type definitions for each input parameters, and return type. When create new immutable states, using spread operator instead of Object.assign to enable strict type checking to prevent any invalid property of state (see reference 11) and example in \src\app\store\reducers\theme.ts. 

The barrel store/reducers/index.ts will define a composite state interface and a composite reducers for the entire module, besides roll up the exports from children. The best practice for defining the composite reducers is to use ActionReducerMap with state interface to make sure the reducers matching with state interface. e.g.
from ngrx platform source example-app

```
export const booksFeatureKey = 'books';

export interface BooksState {
  [fromSearch.searchFeatureKey]: fromSearch.State;
  [fromBooks.booksFeatureKey]: fromBooks.State;
  [fromCollection.collectionFeatureKey]: fromCollection.State;
}

export interface State extends fromRoot.State {
  [booksFeatureKey]: BooksState;
}

/** Provide reducer in AoT-compilation happy way */
export function reducers(state: BooksState | undefined, action: Action) {
  return combineReducers({
    [fromSearch.searchFeatureKey]: fromSearch.reducer,
    [fromBooks.booksFeatureKey]: fromBooks.reducer,
    [fromCollection.collectionFeatureKey]: fromCollection.reducer,
  })(state, action);
}
```

The interface definition should match with reducers function exactly in its tree structure, which guarantee that the returned state has the defined state tree.

Note also use combineReducers helper to create a combined reducers, which is used in:
StoreModule.forFeature(fromBooks.booksFeatureKey, fromBooks.reducers),
=====
old version
====
``` 

export interface ProductsState {
  pizzas: fromPizzas.PizzaState;
  toppings: fromToppings.ToppingsState;
}

export interface State {
  products: ProductsState
}

export const reducers: ActionReducerMap<ProductsState> = {
  pizzas: fromPizzas.reducer,
  toppings: fromToppings.reducer,
};

```
Also a "State" interface can be defined to reflect a branch of state starting from store root.   
However, In reference 2, 
```
interface State extends fromRoot.State 

```
is used instead, which make it dependent on root implementation.

This state definition can then be used in any component constructor where the store with the specific state of the sub-module is injected.

```
export class CollectionPageComponent implements OnInit {
  books$: Observable<Book[]>;

  constructor(private store: Store<fromBooks.State>) {
    this.books$ = store.pipe(select(fromBooks.selectBookCollection));
  }

  ngOnInit() {
    this.store.dispatch(CollectionPageActions.loadCollection());
  }
}
```
The generic type in constructor: Store<fromBooks.State>) has to match the selector used in same context. If you want to use a selector with state not match the "fromBooks.State", you will see typescript error.

As described above, the overall state of a module does not need to derived from the state defined in root module. If the feature state is only used in the same module, you do not need to care about other states from other modules including root module.

if the module state is used outside of the module, you do need to specified using "&":
  private store: Store<fromStore.State & fromStore.fromRouterEx.State>,
  or 
  private store: Store<any>,

5. routerStore
@ngrx/router-store supports router state in the store. With StoreRouterConnectingModule imported, this module will be able to update router state in store. But the app has to register pre-defined routerReducers, in order for router state to be available in store. One can define custom serializer for the router state, also define custom actions such as GO, BACK, FORWARD. All those can be wrapped in module. See details in src/app/router_store_ext module.
May add breadcrumb into router state (?).

6. Use a combination of Action Constant, Action Creator, TypeScript, and the Action interface to enable strict  type checking (see reference 9).

7. meta-reducer
A way of middleware, a function takes a reducer and return a new reducer which wraps around the original one, such as logger. see app.module.ts in this project, and also see ref. 17.

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
8. [Finally understand Redux by building your own Store](https://toddmotto.com/redux-typescript-store) by Todd
9. [NGRX Store: Actions versus Action Creators](https://toddmotto.com/ngrx-store-actions-versus-action-creators)
10. [Todd Motto - Angular Architecture: From Patterns to Implementation](https://www.youtube.com/watch?v=vGKRKDPGUSs) container component handles state, while presentational component use input/output to communicate state.
11. [Object.assign() vs Object Spread { … } In Angular Ngrx Reducers🥊](https://medium.com/@tomastrajan/object-assign-vs-object-spread-in-angular-ngrx-reducers-3d62ecb4a4b0)
12. [Authentication in Angular with NGRX](http://mherman.org/blog/2018/04/17/authentication-in-angular-with-ngrx/#.Wtz7mYjwbIU)
13. [Angular Reactive (ngrx) Authentication](http://brianflove.com/2017/04/10/angular-reactive-authentication/)
14. [ngrx-ngconf-2018, brandonroberts](https://github.com/brandonroberts/ngrx-ngconf-2018/commits/master)
15. [platform/example-app/app/auth/](https://github.com/ngrx/platform/tree/master/example-app/app/auth)
16. [A scalable Angular 2 architecture](https://blog.strongbrew.io/A-scalable-angular2-architecture/), an idea about a sandbox to decouple state management from container (Rule number TWO: Components should not know about the state management layer). Sounds good, need further exploration to wrap ngrx. Also sample github project: **[brechtbilliet/reactive_apps_workshop](https://github.com/brechtbilliet/reactive_apps_workshop)**
17. [Implementing a Meta-Reducer in ngrx/store](https://netbasal.com/implementing-a-meta-reducer-in-ngrx-store-4379d7e1020a)
18. [NgRx — Best Practices for Enterprise Angular Applications](https://itnext.io/ngrx-best-practices-for-enterprise-angular-applications-6f00bcdf36d7)
19. [Angular + Redux — The lesson we’ve learned for you](https://medium.com/supercharges-mobile-product-guide/angular-redux-the-lesson-weve-learned-for-you-93bc94391958)
20. [Angular NgRx Entity - Complete Practical Guide](https://blog.angular-university.io/ngrx-entity/)
21. [NgRx + Facades: Better State Management](https://medium.com/@thomasburleson_11450/ngrx-facades-better-state-management-82a04b9a1e39)