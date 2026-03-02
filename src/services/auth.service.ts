import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
<<<<<<< HEAD
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
=======
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    localStorage.getItem('isAuthenticated') === 'true'
  );
>>>>>>> aae88ef2ebca9e5791e21fb65dcd26a6bc2be000

  private userRoleSubject = new BehaviorSubject<string>(
    localStorage.getItem('role') || 'staff'
  );

<<<<<<< HEAD
  constructor(private http: HttpClient) {
    this.checkSession();
  }

  private checkSession(): void {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const loginTime = localStorage.getItem('loginTime');

    if (isAuthenticated && loginTime) {
      const now = Date.now();
      const twelveHours = 12 * 60 * 60 * 1000;

      if (now - parseInt(loginTime) > twelveHours) {
        this.logout();
      } else {
        this.isAuthenticatedSubject.next(true);
      }
    }
  }

  isSessionExpired(): boolean {
    const loginTime = localStorage.getItem('loginTime');
    if (!loginTime) return true;
    const now = Date.now();
    const twelveHours = 12 * 60 * 60 * 1000;
    return (now - parseInt(loginTime) > twelveHours);
  }
=======
  constructor(private http: HttpClient) { }
>>>>>>> aae88ef2ebca9e5791e21fb65dcd26a6bc2be000

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
<<<<<<< HEAD
        localStorage.setItem('loginTime', Date.now().toString());
=======
>>>>>>> aae88ef2ebca9e5791e21fb65dcd26a6bc2be000

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
<<<<<<< HEAD
    localStorage.removeItem('loginTime');
=======
>>>>>>> aae88ef2ebca9e5791e21fb65dcd26a6bc2be000

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
