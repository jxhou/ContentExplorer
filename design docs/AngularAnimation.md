
# Angular animation summary[^1]
[^1] This doc is currently based on angular 4.2.X
## The general animation meta data structure with possible combination of elements:
```
@Component({
   selector: 'example-app',
   styles: '...'
   animations:                                                                    <--[1]--->
            [
               trigger(
                  'my-trigger1',                                                  <--[2]--->
                  [
                        state('my-state1', style(...)),
                        state('my-state2', style(...)),
                        ...
                        transition('my-state1 <=> my-state2',                     <--[3]--->
                                    [
                                          style(...),
                                          animate(500, style({height: '250px'})), 
                                          animate(500),
                                          group([
                                                style(...),
                                                animate(...),
                                                anmimate(...)
                                          ]),
                                          query(':enter', [                       <--[4]--->
                                                style(...),
                                                stagger(100, [
                                                   animate('0.5s', style(...))
                                                ])
                                          ])
                                    ]
                              ),
                        transition(...)
                  ]
               ),
               ...
               trigger(
                  'my-trigger2',
               ),
               ....
            ],
   template: `
       <div [@my-trigger1]="stateExpression"><div>
   '
})
export class MyExpandoCmp {
  stateExpression: string;
  expand() { this.stateExpression = 'expanded'; }
  collapse() { this.stateExpression = 'collapsed'; }
}
```

1. The "animations" section of component decorator includes an array of trigger: [trigger:, trigger], as shown above: my-trigger1 and my-trigger2.
2. Each trigger has its trigger name, which is used in template as trigger binding, and an array of AnimationMetadata: state(s) and transition(s).
3. Each transition has its stateChangeExpr such as 'my-state1 <=> my-state2', along with a step, or an array of steps. A step could be just:
transition("on <=> off", animate(500)),
Or as complicated as the content in above animation structure.  
When an array of steps is used, it is actually a simplified version of [sequence](https://angular.io/api/animations/sequence) function call, which means the all the steps are executed in sequence as defined by sequenc function. The step in the array could be a [group](https://angular.io/api/animations/group), which a list of animations run in parrallel.  
A step could be a [query](https://angular.io/api/animations/query) function call.
4. a [query](https://angular.io/api/animations/query) has a selector, along with an animation or an array of steps run in sequence, as shown above. A special step is [stagger](https://angular.io/api/animations/stagger), which can only be used in the context of query. The stagger can apply animation to each of the selected elements in sequence with specified delay


## **state**
## declared state using state function  
```
// user-defined states
state("closed", style({ height: 0 }))
state("open, visible", style({ height: "*" }))
```
Each state has its name and associated styles, which will persist on the element after animation.  
## predefined states
There are angular predefined states: "void" (detached from DOM), and "*", which mean any states included any defined states.   

Those two predefined states make two popular state transitions: :enter and :leave values which are aliases for the void => * and * => void state changes. *=>* can also be used as catch-all transition.

It is not necessary to declare state using state function. The declared state using state function has associated style which is persistent with the element after the animation. In more advanced animation examples such as query operation, there is no need for declaring state. The animation styles are then defined in each animation step.  

Animation state transition (:leave/:enter) can be triggered by attach/detach element to/from DOM; or *=>* by updating trigger binding.

## **style function**
Style function can used in a variety of places as shown above.
1. Used in state function such as: state('my-state1', style(...)), which defines styles for start/end states. Then a simple animate() can be applied to a transition between the start/end states without specifying any style info. This is mostly used when apply simple animation to targeted element. When apply sophisticated animation to target component such as coordinating animations among sub-elements of targeted component using query, group function etc., usually state function is not used at all. The animation style defining is delayed in other locations as below:
2. Define style in transition as first step in sequence:  
transition('my-state1 <=> my-state2',                     
            [
                style(...),
                animate(500, style({height: '250px'}))
            ])  
where the 1st style is used as starting style during animation. 
And similarly style defined in group, query function used as starting style.
3. style used within animate function as above, which is used as ending style for animation. All the styles defined other than in state function are only used during animation. The style defined in state function will be persistent after animation ends. 

## Binding animation to element
1. Place an animation trigger on an element within the template in the form of [@triggerName]="expression", where "expression" is from the component definition.
2. Binding to the host element of current component  
export class MyComponent {
  @HostBinding('@profileAnimation')
  public animateProfile = true;
  ...
}  
This is the case when we need to do sophisticated animation for elements on component template. Normally we handle ":enter/:leave" transitions to animate the sub elements of the component without defining any other states.  
Good examples of using @HostBinding: a Component participating angular route, or *ngIf enable/hide component, which will all trigger ":enter/:leave" transitions. So one can configure sophisticated animation of containing elements when component show/hide.

## Animation for route transition
See references 2, 3, and 4.
https://angular.io/guide/router
use @HostBinding to animate route component.
Maybe it is better to let parent to do routing animation (?).

## Child Animation
[Angular Animation Code example](https://jxhou.wordpress.com/2017/08/05/angular-animation/)

<code>
foo = "bar";
baz = "foz";
</code>

## **References**:
0. [Animations (angular doc)](https://angular.io/guide/animations)
1. [ANGULAR ANIMATIONS - FOUNDATION CONCEPTS](https://blog.thoughtram.io/angular/2016/09/16/angular-2-animation-important-concepts.html) by Thomas Burleson   
2. [A WEB ANIMATIONS DEEP DIVE WITH ANGULAR](https://blog.thoughtram.io/angular/2017/07/26/a-web-animations-deep-dive-with-angular.html) by Dominic Elm  
3. [Angular — Supercharge your Router transitions using new animation features (v4.3+)](https://medium.com/google-developer-experts/angular-supercharge-your-router-transitions-using-new-animation-features-v4-3-3eb341ede6c8) by Gerard Sans  
4. [A New Wave of Animation Features in Angular](https://www.yearofmoo.com/2017/06/new-wave-of-animation-features.html)  (The most comprehensive introduction)  
5. [ng4-animations-preview, github project](https://github.com/matsko/ng4-animations-preview) used in 4.
6. [ng4-animations-preview, demo site](http://slides.yearofmoo.com/ng4-animations-preview/demo/)
7. [Angular 2/4 Animations Example](http://www.concretepage.com/angular-2/angular-2-4-animations-example) by Arvind Rai  
8. [Angular — Applying Motion principles to a listing](https://medium.com/@gerard.sans/angular-applying-motion-principles-to-a-list-d5cdd35c899e) by Gerard Sans

