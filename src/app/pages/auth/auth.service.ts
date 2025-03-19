import { Injectable, Inject, PLATFORM_ID  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';
import { isPlatformBrowser } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = `${environment.apiUrl}/auth`;
  private tokenUuid = 'tokenUuid';
  private userId = 'userId'

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(this.tokenUuid, token);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return sessionStorage.getItem(this.tokenUuid);
    }
    return null;
  }

  saveCredentials(email: string, password: string, remember: boolean) {
    if (remember && isPlatformBrowser(this.platformId)) {
      localStorage.setItem('email', email);
      localStorage.setItem('password', password);
    }
  }

  getSavedCredentials() {
    if (isPlatformBrowser(this.platformId)) {
      const email = localStorage.getItem('email') || '';
      const password = localStorage.getItem('password') || '';
      return { email, password };
    }
    return { email: '', password: '' }; // Return empty for SSR
  }

  clearCredentials() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('email');
      localStorage.removeItem('password');
    }
  }

  setUserId(id: any): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(this.userId, id);
    }
  }

  getUserId(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return sessionStorage.getItem(this.userId);
    }
    return null;
  }

  signUp(userInfo: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/signup`, userInfo);
  }

  verifyCode(model: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/verify-code`, model);
  }

  resendCode(model: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/resend-code`, model);
  }

  signIn(userInfo: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, userInfo);
  }

  userInformation(userData: any): Observable<any>  {
    return this.http.patch(`${environment.apiUrl}/user`, userData);
  }

  users(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/user`);
  }

  myInfo(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/user/me`);
  }

  forgotPassword(email: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/forget-password`, email);
  }

  verifyForgotPasswordCode(model: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/forget-password/verify-code`, model);
  }

  verifySecretQuestion(model: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/verify-secret-question`, model);
  }

  resetPassword(userInfo: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/reset-password`, userInfo);
  }

  changePassword(password: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/change-password`, password);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, null);
  }



















  // GET all items
  getItems(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // GET a single item by ID
  getItemById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // POST a new item
  createItem(item: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, item);
  }

  // PUT (update) an existing item
  updateItem(id: number, item: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, item);
  }

  // DELETE an item
  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
