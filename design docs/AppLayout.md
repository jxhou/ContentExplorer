# An Angular route based layout implementation inspired by ref. 11.

## layout module
shared-
   |---layout
         |---components
         |     |---footer
         |     |---navbar
         |---container
         |     |layout
This layout module contains: footer, navbar, and layout components.

## layout.component
\src\app\shared\layout\containers\layout\layout.component.ts
First of all, the layout.component is in the shared module, which signifies that the design goal of the component is reuse in the entire application.  The layout.component should be flexible enough to cover all the layout scenarios in the entire app, although it is not quite there yet. Also the layout.component is placed in containers folder, indicating a smart component. But it is still a dumb component at this time. If it stays that way, maybe move it to components folder.

The layout.component.ts is a route based layout which embedded a <router-outlet></router-outlet> to allow content page to be inserted into the defined layout (see ref.11). This layout component is basically a construction using Angular Material components such as <mat-toolbar>, <mat-sidenav-container>, <mat-sidenav>, and <mat-sidenav-content>, with a toolbar at the top, a side navigation panel on the left, and content page in the middle anchored by the  <router-outlet>. 

To make the layout.component generic and reusable, the implementation allows certain contents to be projected into the the component besides the <router-outlet>. Several different methods have be used to project the content in order to show the diversity, although may not be best practices here.
1. Use  <router-outlet> to allow content projection.
2. Use <ng-content> to populate the content in side navigation panel.
3. Use component's input property to inject a <ng-template> into toolbar.
4. Yet to provide a way to customize footer.
see details in:
\src\app\shared\layout\containers\layout\layout.component.html, and
\src\app\shared\layout\containers\layout\layout.component.ts
This basically allows all the contents in the layout to be customized from host component.

See next section for an example of layout customization.

May create more basic layout configurations in future based on needs.

## app-layout.component
\src\app\containers\app-layout\app-layout.component.ts
This is indeed a smart container component derived from the generic layout.component.ts. It is a container component in the root app module, and acts a root app layout.
This is an example of configuring a concrete layout based on the  layout.component.ts.

This app-layout.component smart component has dependencies on ngrx Store and Angular Router instances. The side Navigation panel is populated with routerLink(s) to featured pages, which will be displayed at the embedded <router-outlet> when click. The routerLink(s) are dynamically inserted based on the configured routes in current router configuration. In order to support this implementation, each route is configured in its data member with location and title information (see \src\app\routing\app.route.ts for details). Only the route labeled with {location: 'SideNav"} will be displayed in the navigation panel. The toolbar is also customized for this app.

reference 8: how to dynamically instantiate template, may be used in dynamic toolbar.  

## **References**:
1. [The complete guide to Angular Material Themes ](https://medium.com/@tomastrajan/the-complete-guide-to-angular-material-themes-4d165a9d24d1) by Tomas Trajan.  
github project: [tomastrajan/angular-ngrx-material-starter](https://github.com/tomastrajan/angular-ngrx-material-starter)  
[Hosted site](https://tomastrajan.github.io/angular-ngrx-material-starter#/about)
2. [Angular documentation project](https://github.com/angular/angular/tree/master/aio) 
Angular documentation project is embedded within angular github project, and is an angular cli project.  
[The hosted site (angular.io)](https://angular.io/)
3. [material.angular.io Github project](https://github.com/angular/material.angular.io)  
Angular material doc project created using angular cli with theme switch.  
[material.angular.io site](https://material.angular.io/)
4. [Angular Material demo github project](https://github.com/angular/material2/tree/master/src/demo-app)  
Angular component demo project with theme switch options
[Angular component demo site](https://tina-material-tree.firebaseapp.com/)
5. [rwa-trivia github project](https://github.com/anihalaney/rwa-trivia)  
A nontrivial real-world-application by anihalaney.   
[The hosted site](https://rwa-trivia.firebaseapp.com).
[material.angular.io site](https://material.angular.io/)
5. [Introducing AngularSpree](https://medium.com/aviabird/introducing-angularspree-ad55bea64d6c)  
[github project](https://github.com/aviabird/angularspree)  
[project documentation](https://aviabird.github.io/angularspree/)
6. [Shape Shifter github project](https://github.com/alexjlockwood/ShapeShifter)  
[demo site](https://shapeshifter.design/)
7. [destiny-dashboard github project](https://github.com/lax20attack/destiny-dashboard/blob/master/angular/src/app/nav/nav.component.html) 
[demo site](https://www.destinydashboard.net/#/dashboard)
8. [Angular ng-template, ng-container and ngTemplateOutlet - The Complete Guide To Angular Templates](http://blog.angular-university.io/angular-ng-template-ng-container-ngtemplateoutlet/)  
9. [ngrx open source and demo-example](https://github.com/ngrx/platform)  
[demo-app site](http://ngrx.github.io/example-app/#/)
10. [Responsive Navbar with Angular Flex Layout](https://theinfogrid.com/tech/developers/angular/responsive-navbar-angular-flex-layout/)
11. [Layout Directory](https://angular-folder-structure.readthedocs.io/en/latest/layout.html) An inspiring Angular route based layout component.