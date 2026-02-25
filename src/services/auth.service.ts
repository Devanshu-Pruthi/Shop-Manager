import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  private userRoleSubject = new BehaviorSubject<string>(
    localStorage.getItem('role') || 'staff'
  );

  constructor(private http: HttpClient) { }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  getUserRole(): Observable<string> {
    return this.userRoleSubject.asObservable();
  }

  isAdmin(): boolean {
    return localStorage.getItem('role') === 'admin';
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users/login`, { email: username, password }).pipe(
      tap((res: any) => {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('username', res.name);
        localStorage.setItem('role', res.role || 'staff');
        localStorage.setItem('userId', res._id);

        this.isAuthenticatedSubject.next(true);
        this.userRoleSubject.next(res.role || 'staff');
      })
    );
  }

  logout(): void {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');

    this.isAuthenticatedSubject.next(false);
    this.userRoleSubject.next('staff');
  }

  getUsername(): string {
    return localStorage.getItem('username') || '';
  }

  getUserId(): string {
    return localStorage.getItem('userId') || '';
  }
}
