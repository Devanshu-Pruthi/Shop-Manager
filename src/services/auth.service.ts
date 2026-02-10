import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  login(username: string, password: string): boolean {
    if (username && password) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', username);
      this.isAuthenticatedSubject.next(true);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    this.isAuthenticatedSubject.next(false);
  }

  getUsername(): string {
    return localStorage.getItem('username') || '';
  }
}
