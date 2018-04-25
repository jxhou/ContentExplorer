
# Angular animation summary[^1]
[^1] This doc is currently based on angular 4.2.X

## Overall View
The "Animations" metadata is defined inside @Component decorator. The "Animations" metadata can include an array of "trigger"(s). Each trigger can include multiple states, and multiple transitions between those states. And each transition can include a sequence of animates, each of which animate different style properties, different part of dom elements, or even coordination between animations. 

After the "Animations" metadata is in place, one can apply the trigger to any DOM tag, and assign value to the trigger by binding an expression, which is evaluated to one of states defined in the "Animations" metadata. Basically upates state of a dom element via the trigger which initiate a state transition.

Besides the custom state defined using state() function, there are default states such as void and '*' wildcard. The custom state has to be explicitly triggered using trigger expression. But the default state such as 'void' can be automatically triggered when an element is attach/detached from dom. So a transition can be triggered when an element is explicitly/implicitly enter a state. 

The visual effect of a transition depends on the styles used for from/to states. All the style information in "Animations" metadata tries to define styles for from/end states in variety of locations. Some styles are state style which will be persistent after animation, some styles are transition style which is only applied during transition.

## The general animation meta data structure with possible combination of elements:
### an example:
```
@Component({
   selector: 'example-app',
   styles: '...'
   animations:                                                           <--[1]--->
      [
          trigger(
            'my-trigger1',                                               <--[2]--->
            [
                  state('my-state1', style(...)),
                  state('my-state2', style(...)),
                  ...
                  transition('my-state1 <=> my-state2',                  <--[3]--->
                    [
                          style(...),
                          animate(500, style({height: '250px'})), 
                          animate(500),
                          group([                                        <--[4]--->
                                style(...),
                                animate(...),
                                animate(...)
                          ]),
                          query(':enter', [                             <--[5]--->
                                style(...),
                                stagger(100, [                          <--[6]--->
                                    animate('0.5s', style(...))
                                ])
                          ]),
                          AnimateChild()
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
### notation for the example:
0. animation DSL function or the step-based animation function such as 
```
sequence([...], { /* options */ })
group([...], { /* options */ })
trigger([...], { /* options */ })
transition([...], { /* options */ })
query([...], { /* options */ })
```
Each function takes an AnimationMetadata or an array of AnimationMetadata, along with an optional option parameter for some of the functions. The array of AnimationMetadata are the sequence of steps of actions or animations. Each step could potentially be one of the animation types:

```
enum AnimationMetadataType {
  State: 0
  Transition: 1
  Sequence: 2
  Group: 3
  Animate: 4
  Keyframes: 5
  Style: 6
  Trigger: 7
  Reference: 8
  AnimateChild: 9
  AnimateRef: 10
  Query: 11
  Stagger: 12
}
```
Potentially there could be many combination of nested animation DSL function, although some of the combinations are common and valid.

1. The "animations" section of component decorator includes an array of trigger: [trigger:, trigger], as shown above: my-trigger1 and my-trigger2.
2. Each trigger has its trigger name, which is used in template as trigger binding, and an array of AnimationMetadata: state(s) and transition(s). Using state() function to define custom state; using transition() function to define transition between defined states.
3. Each transition has its stateChangeExpr such as 'my-state1 <=> my-state2', along with a step, or an array of steps. A transition with one animate() step is as follow:
transition("on <=> off", animate(500)),
Or complicated steps as shown in above animation structure. The possible steps: style(), animate(), group(), query(), and AnimateChild(). When an array of steps is used, it is actually a simplified version of [sequence](https://angular.io/api/animations/sequence) function call, which means the all the steps are executed in sequence as defined by sequence function. 
4. [group](https://angular.io/api/animations/group), which a list of animations run in parallel.  
5. A step could be a [query](https://angular.io/api/animations/query) function call. A query has a selector to find one or more elements within the element that’s being animated, along with an animation or an array of steps run in sequence, as shown above. A special step is [stagger](https://angular.io/api/animations/stagger).
6. Stagger only be used in the context of query. The stagger can apply animation to each of the selected elements in sequence with specified delay.

and some other animation functions:
- animation() can be used to create reusable animations with input parameters
- useAnimation() invokes reusable animations created with animation()
- animateChild() will invoke child animations which are normally blocked


## **State**
### **Custom state, declared using state function:**  
```
// user-defined states
state("closed", style({ height: 0 }))
state("open, visible", style({ height: "*" }))
```
Each state has its name and associated styles, which will persist on the element after animation.  

### **predefined states**
There are angular predefined states: "void" (detached from DOM), and "*", which mean any states included any defined states.   

Those two predefined states make two popular state transitions: :enter and :leave values which are aliases for the void => * and * => void state changes. *=>* can also be used as catch-all transition.

It is not necessary to declare state using state function. The declared state using state function has associated style which is persistent with the element after the animation. In more advanced animation examples such as query operation, there is no need for declaring state. The animation styles are then defined in each animation step.  

Animation state transition (:leave/:enter) can be triggered by attach/detach element to/from DOM; or *=>* by updating trigger binding.

## **Style function**
Style function can be applied in a variety of places as shown above.
1. Used in state function such as: state('my-state1', style(...)), which defines styles for start/end states. Then a simple animate() can be applied to a transition between the start/end states without specifying any style info. This is mostly used when apply a simple animation to targeted element. When apply sophisticated animation to target component such as coordinating animations among sub-elements of targeted component using query, group function etc., usually state function is not used at all. The animation style defining is delayed in other locations as below:
2. Define style in transition as first step in sequence:  
transition('my-state1 <=> my-state2',                     
  [
      style(...),
      animate(500, style({height: '250px'}))
  ])  
where the 1st style is used as starting style during animation. 
And similarly style defined in group, query function used as starting style.
3. style used within animate function as above, which is used as ending style for animation. All the styles defined other than in state function are only used during animation. The style defined in state function will be persistent after animation ends. 
4. A starting style can also defined by using query() function:
```
animations: [
  trigger('statsAnimation', [
    transition('* => *', group([
      query('.stats-icon', style({ opacity: 0, transform: 'scale(0.8) translateY(10px)' })),  <=== set initial style
      query('.stats-text', style({ opacity: 0 })),    <========== set initial style

      query('.stats-icon', stagger('100ms', [
        animate('200ms 250ms ease-out', style('*'))
      ])),

      query('.stats-text', stagger('100ms', [
        animate('200ms 250ms ease-out', style('*'))
      ])),
    ])
  ])
]
```
The first two query() without calling animate() set the starting styles.

## More about styles
There are two types of styles:
* State styles:
  Applied to the element while it is in the state, which is defined in state function. Removed when the state changes.
* Transition styles:
  Applied to the element while it is transitioning to its Final State, defined in transition function scope. Removed when the Final State is applied (with its State Styles) .
  Inside Transition Styles, there are also two types:
  * ‘From’ styles:
    Placed at the beginning of the transition, they will be applied to the element right when it’s created.
  * ‘To’ styles:
    Placed inside animate(), they will be used to transition to it from the ‘from’ style, in this case ‘void’.
```
  trigger('enterLeave', [
     transition('void => *', [
       // 'From' Style
       style({ opacity: 0.2, transform: 'translateX(-100%)' }),   
       animate('1500ms ease-in',
         // 'To' Style
         style({ opacity: 1, transform: 'scale(1.5)' }),     
       )
     ])
   ])
```

In order for animation to work, the styles of an initial and final states have to be defined. If we apply enter animation to an element, we’ll see that nothing happens. That is because in the ‘void’ state the element is not present in the view, so it doesn’t have any style to transition from. Therefore transition styles are needed for the void state. For other default state, by default, the Final State is the state of the element naturally placed in the view, with the properties we have applied to it in CSS. Sometimes, you will see element animating between transition styles, and at the end abruptly show the state style.


## More about styles again, when/where do we specify styles for animation
As mentioned in above, there are state styles, and transition styles, which also can be classified as from or to styles. The state style is more about the persistent styles which will stay after animation. The state style can be defined explicitly by state function, but also implicitly exist as default style which is whatever style applied to an element when no animation is involved. Therefore during animation, there could be four styles involved in transition:  

starting persistent style -> starting transition style --animation--> ending transition style -> ending persistent style  

Based on different scenarios, sometimes all four styles are specified, and sometimes only parts of styles are specified.   

When starting and ending persistent styles are different, which can be used as starting and ending styles in animation directly without introducing transition styles. However when starting and ending persistent styles are same or not defined such as void state, we do have to specify different starting/ending transition styles for animation.  

The transition between starting persistent style and starting transition styles, and transition between ending transition style and ending persistent style are abrupt, while the transition between starting transition style and ending transition style are animated.

The persistent styles always exist except for void state. It is a good practice to use the corresponding persistent styles as transition style to avoid abrupt style jumping at begin or end of animation.

Auto-styles (using *), a way to specify whatever the state style will be.

When specify animation using from/to styles, an easing function is used in animate() function to control how css properties will animate. Angular animation also allows using keyframes() function to define a sequence of css styles, which gives full control over more sophisticated animation. Check out the ng-animate reusable library (ref: #13) which uses keyframes() extensively instead of using easing function.

## Binding animation to element
1. Place an animation trigger on an element within the template in the form of [@triggerName]="expression", where "expression" is from the component definition. The expression will be evaluated to a state to trigger a state transition.
2. Binding to the host element of current component  
export class MyComponent {
  @HostBinding('@profileAnimation')
  public animateProfile = true;
  ...
}  
This is the case when we need to do sophisticated animation for elements on component template. Normally we handle ":enter/:leave" transitions to animate the sub elements of the component without defining any other states.  
Good examples of using @HostBinding: a Component participating angular route, or *ngIf enable/hide component, which will all trigger ":enter/:leave" transitions. So one can configure sophisticated animation of containing elements when component show/hide (more details in next section of route transition).

## Animation for route transition
See references 2, 3, and 4.
https://angular.io/guide/router
Component uses @HostBinding to animate itself with translateX and opacity properties when :enter and :leave occur.  
The better option is to animate routing in outlet container component.


## Child Animation
[Angular Animation Code example](https://jxhou.wordpress.com/2017/08/05/angular-animation/)



## **References**:
0. [Animations (angular doc)](https://angular.io/guide/animations)
1. [ANGULAR ANIMATIONS - FOUNDATION CONCEPTS](https://blog.thoughtram.io/angular/2016/09/16/angular-2-animation-important-concepts.html) by Thomas Burleson   
2. [A WEB ANIMATIONS DEEP DIVE WITH ANGULAR](https://blog.thoughtram.io/angular/2017/07/26/a-web-animations-deep-dive-with-angular.html) by Dominic Elm  
3. [Angular — Supercharge your Router transitions using new animation features (v4.3+)](https://medium.com/google-developer-experts/angular-supercharge-your-router-transitions-using-new-animation-features-v4-3-3eb341ede6c8) by Gerard Sans  about routing animation
4. [A New Wave of Animation Features in Angular](https://www.yearofmoo.com/2017/06/new-wave-of-animation-features.html)  (The most comprehensive introduction by Matias starting from Angular 4.2)  
5. [ng4-animations-preview, github project](https://github.com/matsko/ng4-animations-preview) github example project referenced in reference 4.
6. [ng4-animations-preview, demo site](http://slides.yearofmoo.com/ng4-animations-preview/demo/)
7. [Angular 2/4 Animations Example](http://www.concretepage.com/angular-2/angular-2-4-animations-example) by Arvind Rai  
8. [Angular — Applying Motion principles to a listing](https://medium.com/@gerard.sans/angular-applying-motion-principles-to-a-list-d5cdd35c899e) by Gerard Sans
9. [Angular Animations: motion makes meaning](https://youtu.be/JhNo3Wvj6UQ?t=2h46m38s) Angular connect 2017 video.  
[AngularConnect Animation Demo link](http://animationsftw.in/#/)
[matsko/AnimationMovieWebsite source code](https://github.com/matsko/AnimationMovieWebsite)  
The most recent comprehensive animation demo code example using ng5.0.0 rc8 by Motias.
10. [How To Style Angular Application Loading With Angular CLI Like a Boss](https://medium.com/@tomastrajan/how-to-style-angular-application-loading-with-angular-cli-like-a-boss-cdd4f5358554)  
About app loading animation: to be implemented.
11. [Angular & Animations: bring life to your apps](https://medium.com/@aleixsuau/angular-animations-bring-life-to-your-apps-ca122e5db647) The best explanation about the animation syntax.
12. [Angular Animations — Stagger Over Static and Async Data](https://itnext.io/angular-animations-stagger-over-static-and-async-data-3907c4889479)
13. [jiayihu/ng-animate](https://github.com/jiayihu/ng-animate) cool reusable ng-animations
14. [demo site](https://jiayihu.github.io/ng-animate/)
15. [Angular in motion: 4 approaches to animation by Tomek Sułkowski](https://medium.com/@tomsu/angular-in-motion-4-approaches-to-animation-1aa7426aae5a)
Discussed different animation approaches including angular animation, also routing animation. 
15. [Angular Router Animations: the tricky bits by Tomek Sułkowski](https://medium.com/@tomsu/angular-router-animations-what-they-dont-tell-you-3d2737a7f20b) A more advanced routing animation, which can slide routing components in/out in both directions based on its position.