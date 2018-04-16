### List of Patterns and Best Practices Used, and feature implementations in this Project

* Project structure (see details in 'ProjectStructure.md').
* ngrx folder structure (see details in 'ngrx for state management.md')
* Aliases for app and environments (@app and @env in tsconfig.json), prerequisite: > angular 5.1.0.
* Angular material themes
* Use .takeUntil() to unsubscribe observable (more in 'ngrx for state management.md').
* Best practices for defining action, reducer functions in ngrx to allow strict type checking (Details in 'ngrx for state management.md').
* Dynamic SettingsModule which allow feature module to add its setting page to settings container (more details in Router.md).
 