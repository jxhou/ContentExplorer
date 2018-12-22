The idea of monorepo, placing all projects in one single repository, is getting popular with big companies such as google, facebook etc. For small and medium products, the project monorepo (ref 7) can be effective too.

Nx (ref 3) built on the top of angular cli is the first framework to provide workspace support in the form of monorepo. xplat built on top of Nx provides cross platform support.

Starting from angular 6.0, Angular cli supports workspace natively (ref 1, 2).

1. [stories multiple projects, angular cli wiki](https://github.com/angular/angular-cli/wiki/stories-multiple-projects)
2. [stories create library, angular cli wiki](https://github.com/angular/angular-cli/wiki/stories-create-library)
3. [Nx workspace](https://nrwl.io/nx/guide-getting-started)
4. [Introducing xplat, multi-platform tools for Nx workspace](https://nstudio.io/blog/introducing-xplat/)
5. [Adding livereload to the Angular CLI libraries](https://mereommig.dk/en/blog/adding-livereload-to-the-angular-cli-libraries)
6. [Super Charging an Angular CLI App](https://blog.angularindepth.com/super-charging-an-angular-cli-app-fc496a6c100)
7. [Monorepos in the Wild](https://medium.com/@maoberlehner/monorepos-in-the-wild-33c6eb246cb9)
8. [You too can love the MonoRepo](https://medium.com/@Jakeherringbone/you-too-can-love-the-monorepo-d95d1d6fcebe)
9. [You can have a MonoRepo and Packaged Angular Libraries at the same time!!!](https://medium.com/@angularlicious/monorepo-angular-packaged-libs-you-can-have-your-cake-and-eat-it-too-8c5687c4ffe9)
10. [Creating a Library in Angular 6](https://blog.angularindepth.com/creating-a-library-in-angular-6-87799552e7e5)
11. [Understanding the Angular CLI Workspace File](https://nitayneeman.com/posts/understanding-the-angular-cli-workspace-file/)
12. [Creating A Simple Library Using Angular CLI 6](https://keyholesoftware.com/2018/06/04/simple-library-angularcli6/) without any library install, but relies on "paths" in tsconfig.json
13. [Of Libraries and Applications](https://medium.com/@uakennysoft/of-libraries-and-applications-8b7de2c7c82d) using link to use lib, not necessary. An interesting abstract service defined in lib and concrete one provided by its clients.
14. [The Angular Library Series - Creating a Library with the Angular CLI](https://blog.angularindepth.com/creating-a-library-in-angular-6-87799552e7e5)
15. [The Angular Library Series - Building and Packaging](https://blog.angularindepth.com/creating-a-library-in-angular-6-part-2-6e2bc1e14121) using npm install local-libray-file.tgz
16. [Angular 6 Library — The CLI Way!](https://medium.com/@zaheeer1/angular-6-library-the-cli-way-9777f1505882)
17. [Getting Started Building Component Libraries with Angular CLI](https://itnext.io/angular-cli-libraries-79b0a32a1443)
18. [Angular Libraries and Microservices](https://dzone.com/articles/angular-libraries-and-microservices-1) A client-side UI composition design pattern for server microservices, using angular cli workspace and libraries.
https://github.com/agoncal/agoncal-sample-angular/tree/master/cdbookstore/projects
