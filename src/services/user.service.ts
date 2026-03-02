import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';

export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'staff';
    createdAt?: Date;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = `${environment.apiUrl}/users`;
    private usersSubject = new BehaviorSubject<User[]>([]);

    constructor(private http: HttpClient) { }

    fetchUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl).pipe(
            tap(users => this.usersSubject.next(users))
        );
    }

    getUsers(): Observable<User[]> {
        return this.usersSubject.asObservable();
    }

    createUser(user: Partial<User> & { password?: string }): Observable<User> {
        return this.http.post<User>(this.apiUrl, user).pipe(
            tap(() => this.fetchUsers().subscribe())
        );
    }

    updateUser(id: string, user: Partial<User> & { password?: string }): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${id}`, user).pipe(
            tap(() => this.fetchUsers().subscribe())
        );
    }

    deleteUser(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`).pipe(
            tap(() => this.fetchUsers().subscribe())
        );
    }
}
