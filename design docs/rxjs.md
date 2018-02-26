
# Unsubscribe Observable
1. Some angular observables do not need un-subscription: Async pipe, @HostListener, Finite Observable such as http service and timer observable (see ref 4). Angular automatically unsubscribe the observable when use in Async pipe (@HostListener as well?). Some other angular observable such as http service is finite observable. 

Finite observable does not need unsubscribe, because it completes (fire complete event). When unsubscribe an observable, the observer does not care about the data in the observable any more. The observer does not see the complete event at all. The observable may not be complete. In either case of unsubscribing observable or observable complete by itself, the subscription is terminated, and associated memory is released.

2. All other cases need unsubscribe to avoid memory leak.

3. Avoid manually unsubscribe if you can. (ref 3).

4. Use rxjs operators to make your observable finite: .first(), .take(), .elementAt(), .takeUntil(), and .takeWhile() (ref 2).

5. Use .takeUntil() to unsubscribe observable (ref 1).
See app.component.ts for the usage of this trick to subscribe/unsubscribe them state from store.

## References:
1. [Using the takeUntil RxJS Operator to Manage Subscriptions Declaratively](https://alligator.io/angular/takeuntil-rxjs-unsubscribe/)
2. [Manage your observable subscriptions in Angular with help of rx.js](https://hackernoon.com/manage-your-observable-subscriptions-in-angular-with-help-of-rx-js-f574b590a5cb)  
3. [RxJS: Don’t Unsubscribe](https://medium.com/@benlesh/rxjs-dont-unsubscribe-6753ed4fda87)  
4. [When to Unsubscribe in Angular](https://netbasal.com/when-to-unsubscribe-in-angular-d61c6b21bad3)  

