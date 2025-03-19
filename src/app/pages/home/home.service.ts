import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { concatMap, from, map, Observable, toArray } from 'rxjs';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private baseUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {}
  
  createAuction(model: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auction`, model);
  }

  getAuctions(params?: { [key: string]: any }): Observable<any> {
    let httpParams = new HttpParams();
  
    if (params) {
      Object.keys(params).forEach(key => {
        if(params[key]) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
  
    return this.http.get<any>(`${this.baseUrl}/auction`, { params: httpParams });
  }

  getAuctionById(id: number | any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/auction/${id}`);
  }

  getShippingRates(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/auction/shipping-rate`);
  }

  toggleFavourite(id: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/auction/${id}/toggle-favorite`, null);
  }

  bid(model: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auction/bid`, model);
  }

  contact(model: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/user/contact-admin`, model);
  }

  publicContact(model: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/user/public/contact-admin`, model);
  }

  manufacturers(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/manufacturer`);
  }

  models(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/model`);
  }

  uploadFile(file: any): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
  
    return this.http.post<any>(`${this.baseUrl}/media/upload`, formData).pipe(
      map(response => response.Id) // Extract ID from response
    );
  }

  uploadMultipleFiles(files: any): Observable<string[]> {
    return from(files).pipe(
      concatMap((f: any) => this.uploadFile(f.file)), // Upload sequentially
      toArray() // Collect all IDs
    );
  }
}
