# ContentExplorer

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.1.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Features

### Demo

[demo](https://jxhou.github.io/ContentExplorer)

Use angular-cli-ghpages to deploy the Angular app to Github from Angular Cli.

See more details in:
    \github\ContentExplorer\design docs\Deploy Angular App to Github.md

### Run production app in docker container

If you have a docker environment such as Docker desktop, run following steps:

1. docker build -t myapp .
    To build a docker image of Nginx to serve the SPA.
2. docker run -p 8080:80 myapp
    Start the container.

or using docker-compose:

docker-compose up --build

Then access your app from browser at localhost:8080.

Can also run app in dev mode using either docker cli or docker-compose.

See more details in:
/design docs/Run production app in docker container.md

### Mock backend with In Memory Web API

Use angular-in-memory-web-api package to simulate a backend REST api for Dev env.

Mock backend with [In Memory Web API](https://github.com/angular/in-memory-web-api).

See more details in:
design docs/Mock backend with In Memory Web API.md

### Angular material


