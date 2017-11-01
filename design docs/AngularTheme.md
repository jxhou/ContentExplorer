# Angular material themes

Angular material has a strong built-in theming capability. In this project, I will try to explore every aspects of angular material theme subjects, which include using prebuilt theme, custom theme, applying material theme to my custom components, and theme switch.

## 1. Use prebuilt themes  
Available pre-built themes are: deeppurple-amber, indigo-pink, pink-bluegrey, and purple-green. Those themes can be included in either index.html or style.scss based on the angular material doc, in order to make all angular material components themed.  
However there is a significant limitation to this approach, that there is no way to apply the pre-built theme to any other custom components created in this projects. Therefore I reproduce the predefined themes as custom themes in your project.

## 2. Custom themes:
I have duplicated all the theme definitions for all four prebuilt themes based on the information from reference [2], stored in /source/themes/ folder:  
deeppurple-amber.scss, indigo-pink.scss, pink-bluegrey.scss, and purple-green.scss  
Different from the original theme file, each theme file only include theme definitions with a theme variable defined, which then should be imported in style.scss with a valid material theme context.

## 3. Multiple themes and theme switch:
In style.scss, we import all custom themes from /source/themes/ folder:
```
@import 'themes/deeppurple-amber.scss';
@import 'themes/indigo-pink.scss';
@import 'themes/purple-green.scss';
@import 'themes/pink-bluegrey.scss';
```
In order to switch the theme, each theme is created under a gated class:
```
.deeppurple-theme {
  @include angular-material-theme($deeppurple-theme);
  @include app-theme($deeppurple-theme);
}

.indigo-theme {
  @include angular-material-theme($indigo-theme);
  @include app-theme($indigo-theme);
}

.pink-theme {
  @include angular-material-theme($pink-theme);
  @include app-theme($pink-theme);
}

.purple-theme {
  @include angular-material-theme($purple-theme);
  @include app-theme($purple-theme);
}
```
The gated theme will only be applied to all components which are the child elements of parent element with gated class.  

In order to apply the theme, we can simply dynamic change the class of root component. In our case, we control the class using host: in app.component:  
```
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  host: {
    '[class]' : 'theme',
  }
})
export class AppComponent {
  title = 'app';
  theme = 'pink-theme';
}
```

In reference [4], there is a theme picker component where the theme switch is implemented by compiling local version of pre-built angular material themes first and then replacing css link in index.html dynamically.

## Apply selected theme to custom components:
Angular material theme allows you to apply the theme to your own components at sass level.  You cannot apply prebuilt theme, which is css file, to your own components. 
Create custom theme, and then write a mixin taking a theme for each of your component in its theme scss file, where apply theme color to your component. Each component should have a standard style file which define size, location etc. of your component, and also have a theme style file to describe the color usage from selected material theme.

_app.component-theme.scss is the root theme style where all component based theme styles should be added. Potentially all the component theme styles can be imported in a tree structure just like components themselves. Follow is the code show how to apply a theme to both angular material components as well to custom components in styles.scss 

```
@import 'themes/indigo-pink.scss';
@import './app-theme';
.deeppurple-theme {
  @include angular-material-theme($deeppurple-theme);
  @include app-theme($deeppurple-theme);
}
```
where app-theme is a mixin defined in app-theme.scss, where other mixins for custom components are included.
That is exactly how angular-material-theme mixin is implemented.

## **References**:
1. [The complete guide to Angular Material Themes ](https://medium.com/@tomastrajan/the-complete-guide-to-angular-material-themes-4d165a9d24d1) by Tomas Trajan.  
github project: [tomastrajan/angular-ngrx-material-starter](https://github.com/tomastrajan/angular-ngrx-material-starter)  
[Hosted site](https://tomastrajan.github.io/angular-ngrx-material-starter#/about)
2. [CUSTOM THEMES WITH ANGULAR MATERIAL](https://blog.thoughtram.io/angular/2017/05/23/custom-themes-with-angular-material.html) by Pascal Precht  
3. [Official Google theming guide](https://github.com/angular/material2/blob/master/guides/theming.md).
4. [material.angular.io Github project](https://github.com/angular/material.angular.io)  
Angular material doc project created using angular cli with theme switch.  
[material.angular.io site](https://material.angular.io/)
5. [Angular Material demo github project](https://github.com/angular/material2/tree/master/src/demo-app)  
Angular component demo project with theme switch options
[Angular component demo site](https://tina-material-tree.firebaseapp.com/)
6. [Creating Themeable Components in Angular 2+ ](http://anasfirdousi.com/creating-theamable-components-in-angular.html)  
A non-angular material theme method