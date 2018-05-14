### List of Patterns and Best Practices Used, and feature implementations in this Project

* Project structure (see details in 'ProjectStructure.md').
* ngrx folder structure (see details in 'ngrx for state management.md')
* Aliases for app and environments (@app and @env in tsconfig.json), prerequisite: > angular 5.1.0.
* Angular material themes
* Use .takeUntil() to unsubscribe observable (more in 'ngrx for state management.md').
* Best practices for defining action, reducer functions in ngrx to allow strict type checking (Details in 'ngrx for state management.md').
* Dynamic SettingsModule which allow feature module to add its setting page to settings container (more details in Router.md).
* meta-reducer with logger, see (app.module.ts)
--------  
 to be implemented:
-------------  
* Angular loading animation (AngularAnimation.md, ref 10).
* full animation playground.
* ngrx based authentication (ngrx for state management.md, technology.md, ref.3).
* decouple container from ngrx (ngrx for state management.md).
* build breadcrumb into ngrx's router state (technology.md, ref.4)
* backend mocking (technology.md, ref.6).
* Inactivity Auto-Logout w/ Angular and Ngrx (technology.md, ref.9).
* Runtime configuration of your Angular App (technology.md, ref.7).
* mono-repo, Nx, xPlat, or cli workspace? (technology.md, ref.7).