import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  baseUrl = 'https://bookstore.incubation.bridgelabz.com/';

  constructor(private http: HttpClient) {}

  getHeader() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem('token') || '',
    });
  }

  getApi(endpoint: string, headers: HttpHeaders = new HttpHeaders()) {
    return this.http.get(this.baseUrl + endpoint, { headers });
  }

  postApi(
    endpoint: string,
    payload: any,
    headers: HttpHeaders = new HttpHeaders()
  ) {
    return this.http.post(this.baseUrl + endpoint, payload, { headers });
  }

  putApi(
    endpoint: string,
    payload: any,
    headers: HttpHeaders = new HttpHeaders()
  ) {
    return this.http.put(this.baseUrl + endpoint, payload, { headers });
  }

  deleteApi(endpoint: string, headers?: HttpHeaders) {
    return this.http.delete(this.baseUrl + endpoint, {
      headers: headers || this.getHeader(),
    });
  }
}
