import {Injectable, TemplateRef} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class SettingHostService {
    contextReceivedSource = new BehaviorSubject<any>([]);
    contextReceived$ = this.contextReceivedSource.asObservable();

    receiveContext({}) {
        this.contextReceivedSource.next({});
    }
}
