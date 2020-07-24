import { Injectable, SystemJsNgModuleLoaderConfig } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../model/user';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';

const USER_DATA = 'user_data';

@Injectable({
    providedIn: 'root'
})
export class AuthStore {

    private userSubject = new BehaviorSubject<User>(null);
    user$: Observable<User> = this.userSubject.asObservable();

    isLoggedIn$: Observable<boolean>;
    isLoggedOut$: Observable<boolean>;

    constructor(private http: HttpClient) {
        this.isLoggedIn$ = this.user$.pipe(
            map(user => !!user)
        );

        this.isLoggedOut$ = this.isLoggedIn$.pipe(
            map(loggedIn => !loggedIn)
        );

        const userData = localStorage.getItem(USER_DATA);
        if (userData) {
            this.userSubject.next(JSON.parse(userData));
        }
    }

    login(email: string, password: string): Observable<User> {
        return this.http.post<User>('/api/login', {email, password}).pipe(
            tap(user => {
                this.userSubject.next(user);
                localStorage.setItem(USER_DATA, JSON.stringify(user));
            }),
            shareReplay()
        );
    }

    logOut() {
        this.userSubject.next(null);
        localStorage.removeItem(USER_DATA);
    }
}
