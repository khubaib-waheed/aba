import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private baseUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {}
  
  createAd(model: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auction`, model);
  }
}
