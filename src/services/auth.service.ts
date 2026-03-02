import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  private userRoleSubject = new BehaviorSubject<string>(
    localStorage.getItem('role') || 'staff'
  );

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
        localStorage.setItem('loginTime', Date.now().toString());

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
    localStorage.removeItem('loginTime');

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
