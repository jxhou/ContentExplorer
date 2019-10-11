import {Injectable, TemplateRef} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingHostService {
    contextReceivedSource = new BehaviorSubject<any>([]);
    contextReceived$ = this.contextReceivedSource.asObservable();

    addSettingRoute(route) {
        this.contextReceivedSource.next(route);
    }
}
