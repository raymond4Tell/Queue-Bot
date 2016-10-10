import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

export class User {
    constructor(
        public email: string,
        public password: string) { }
}

@Injectable()
export class UserService {
    private loggedIn = false;

    constructor(private http: Http) {
        this.loggedIn = !!sessionStorage.getItem('auth_token');
    }

    login(email: string, password: string) {
        let headers = new Headers({ 'Content-Type': 'application/json'});

        return this.http
            .post(
            '/login',
            JSON.stringify({ email, password }),
            { headers }
            )
            .map(res => res.json())
            .map((res) => {
                if (res.success) {
                    sessionStorage.setItem('auth_token', res.auth_token);
                    this.loggedIn = true;
                }

                return res.success;
            });
    }

    logout() {
        sessionStorage.removeItem('auth_token');
        this.loggedIn = false;
    }

    isLoggedIn() {
        return this.loggedIn;
    }
}