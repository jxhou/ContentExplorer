## Run Angular application in a Docker container

The app can be served in docker container using either docker cli or docker-compose commands.

The app can be built in either production or dev mode.

In dev mode, we will create a container hosting an Angular default web server, basically run "ng serve" inside the container. In order to do hot reloading upon source code update, we need to share the source code using volume along with polling for WSL and docker machine environments.

In production mode, we build an image of nginx as web server serving the static production app resource. In this case, we do not care about hot-reloading.

For running the app in dev mode, it is faster running outside of container.

See more details in ref.1.

### Dockerfile

> D:\github\ContentExplorer\Dockerfile

 Using multistage builds: app build stage and Nginx image to serve the static app resource.
 The app is built in production mode.

 docker commands:

* docker build  -t myapp .
  To build a docker image of Nginx to serve the SPA.
* docker run -p 8080:80 myapp
  Start the container.

### Dockerfile.dev

> D:\github\ContentExplorer\Dockerfile.dev

Define a container which host the angular default dev web server in dev mode.
The critical part is to use:
ng serve --host 0.0.0.0
to start the web server.

docker commands:

* $ docker build -f Dockerfile.dev -t myapp .
  Use Dockerfile.dev to build an image with Angular default dev server.
* $ docker run -d -v ${PWD}:/app -v /app/node_modules -p 4201:4200 -e CHOKIDAR_USEPOLLING=true --rm myapp
  -d: in detach mode
  -v ${PWD}:/app: map the source code into the container
  -v /app/node_modules: do not map node_modules folder
  -p 4201:4200: port mapping for external access
  -e CHOKIDAR_USEPOLLING=true: make hot reloading work in WSL or docker machine envirionments
  --rm: remove container and volumes after container exit

### docker-compose.yml

> D:\github\ContentExplorer\docker-compose.yml

docker-compose Command:

docker-compose up

access the app at localhost:8080

### docker-composer-dev.yml

D:\github\ContentExplorer\docker-compose-dev.yml

docker-compose Command:

docker-compose -f docker-compose-dev.yml up

access the app at localhost:4201

## References

1. [Dockerizing an Angular App](https://mherman.org/blog/dockerizing-an-angular-app/)

2. [Build and run Angular application in a Docker container](https://wkrzywiec.medium.com/build-and-run-angular-application-in-a-docker-container-b65dbbc50be8)
