
# Unsubscribe Observable
1. Some angular observables do not need un-subscription: Async pipe, @HostListener, Finite Observable such as http service and timer observable (see ref 4). Angular automatically unsubscribe the observable when use in Async pipe (@HostListener as well?). Some other angular observable such as http service is finite observable. 

Finite observable does not need unsubscribe, because it completes (fire complete event). When unsubscribe an observable, the observer does not care about the data in the observable any more. The observer does not see the complete event at all. The observable may not be complete. In either case of unsubscribing observable or observable complete by itself, the subscription is terminated, and associated memory is released.

2. All other cases need unsubscribe to avoid memory leak.

3. Avoid manually unsubscribe if you can. (ref 3).

4. Use rxjs operators to make your observable finite: .first(), .take(), .elementAt(), .takeUntil(), and .takeWhile() (ref 2).

5. Use .takeUntil() to unsubscribe observable (ref 1).
See app.component.ts for the usage of this trick to subscribe/unsubscribe them state from store.

# mergeMap (flatMap), concatMap, switchMap
Higher order Observables: This is when items of an Observable are Observables themselves. The initial Observable is called outer Observable. And items of the outer Observable are called inner Observables. And we need to flatten all of them into one final Observable.

1. mergeMap: the inner observables can fire concurrently, then merge together without preserving the order.
2. concatMap: waits for inner Observable to complete before taking items from the next inner Observable sequentially; does preserve the order from outer Observable.
3. switchMap: cancels previous inner Observables when a new inner Observable appears. Items of inner Observable that were emitted after the Observable was canceled will be lost (not included in the resulting Observable).
(ref 5 for more details).

In many angular use cases, the inner observable, such as http service, will complete with only one item. In those simple cases, we can fire http requests concurrently (mergeMap), or sequentially (concatMap), or cancel previous request (exclude results from previous), after new request (switchMap). It is quite obviously which one to use in real application, once one know the difference. Search is one of scenarios in which switchMap can be used, where previous search results are not needed after new search term is generated.

See ref 6 for some more discussion about the usage of the higher order observables.
## References:
1. [Using the takeUntil RxJS Operator to Manage Subscriptions Declaratively](https://alligator.io/angular/takeuntil-rxjs-unsubscribe/)
2. [Manage your observable subscriptions in Angular with help of rx.js](https://hackernoon.com/manage-your-observable-subscriptions-in-angular-with-help-of-rx-js-f574b590a5cb)  
3. [RxJS: Don’t Unsubscribe](https://medium.com/@benlesh/rxjs-dont-unsubscribe-6753ed4fda87) 
4. [When to Unsubscribe in Angular](https://netbasal.com/when-to-unsubscribe-in-angular-d61c6b21bad3)  
5. [mergeMap vs flatMap vs concatMap vs switchMap](https://tolikcode.github.io/post/rxjsMap/)
6. [Your NGRX Effects are Probably Wrong](https://medium.com/@amcdnl/your-ngrx-effects-are-probably-wrong-574460868005)
