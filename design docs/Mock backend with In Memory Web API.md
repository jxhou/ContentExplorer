# **Use angular-in-memory-web-api package to simulate a backend REST api for Dev env**

There is a little known tool in the Angular repo called In Memory Web API.
It is a http interceptor which will intercept all your HTTP calls and return mock data for you. You don’t have to hardcode anything or rely on your backend team anymore. The tool makes everything seamless even mimicking delayed responses if you want it too. You can set headers, response types, basically everything you might do with a server.

## Implementation in current project

    1. Define your interface;
    D:\github\ContentExplorer\src\app\core\services\in-memory-data.service.ts
    
        @Injectable({
        providedIn: 'root'
        })
        export class InMemoryDataService implements InMemoryDbService {

        constructor() { }
        createDb() {
            let heroes = [
            { id: 1, name: 'Windstorm' },
            { id: 2, name: 'Bombasto' },
            { id: 3, name: 'Magneta' },
            { id: 4, name: 'Tornado' }
            ];
            const users =[
            { id: 1, name: 'user1', password: 'password1' },
            { id: 2, name: 'user2', password: 'password2' },
            ]
            return {heroes, users};
        }
        }

    2. Install the mocked backend
    D:\github\ContentExplorer\src\app\app.module.ts
        import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api'
        import { InMemoryDataService } from './core/services/in-memory-data.service'
        @NgModule({
            imports: [
            
                // install a mocked api endpoint for dev
                !environment.production ? HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, { delay: 500 }) : [],
            ],
            bootstrap: [AppComponent]
            })
            export class AppModule { 
            }
        }

## **References**

1. Mock backend with [In Memory Web API](https://github.com/angular/in-memory-web-api).
2. [Mocking with Angular: More than just unit testing](https://medium.com/@amcdnl/mocking-with-angular-more-than-just-unit-testing-cbb7908c9fcc) Add backend mocking
