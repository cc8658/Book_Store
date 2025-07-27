import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpService) {}

  login(payload: any) {
    return this.http.postApi('bookstore_user/login', payload);
  }

  register(payload: any) {
    return this.http.postApi('bookstore_user/registration', payload);
  }

  putInfo(payload: any) {
    return this.http.putApi(
      'bookstore_user/edit_user',
      payload,
      this.http.getHeader()
    );
  }

  getFeedback(productId: string) {
    return this.http.getApi(
      `bookstore_user/get/feedback/${productId}`,
      this.http.getHeader()
    );
  }

  postFeedback(productId: string, payload: any) {
    return this.http.postApi(
      `bookstore_user/add/feedback/${productId}`,
      payload,
      this.http.getHeader()
    );
  }
}
