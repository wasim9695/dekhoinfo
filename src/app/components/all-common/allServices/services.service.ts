import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {EnvService} from './env.service';
import { BehaviorSubject, Observable } from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {allModel} from '../allModels';
@Injectable({ providedIn: 'root' })
export class ServicesService {
  private url = '/authenticateCustomer';
  private getCustomerData = '/getCustomerData';
  private urlR = '/createCustomer';
  private postCreate = '/createPost';
  private getPosts = '/getAllPost'; 
  private getPostDataID = '/getAllPostID';
  private currentUserSubject: BehaviorSubject<allModel>;
    public currentUser: Observable<allModel>;
  constructor(private http: HttpClient,
    private env: EnvService) {
      this.currentUserSubject = new BehaviorSubject<allModel>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
     }

    public get currentUserValue(): allModel {
      return this.currentUserSubject.value;
  }
    login(Email: string, Password: string): Observable<any> {
      return this.http.post<any>(`${this.env.apiUrl + this.url}`, { Email: Email, Password: Password })
          .pipe(map(user => {
              // store user details and jwt token in local storage to keep user logged in between page refreshes
             //localStorage.setItem('currentUser', JSON.stringify(user));
             localStorage.setItem('currentUser', JSON.stringify(user));
              this.currentUserSubject.next(user);
              return user;
          }));
  }
  refreshToken() {
    localStorage.getItem('currentUser');
  }

  logout() {
    //console.log("hello");
      // remove user from local storage and set current user to null
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
      return false;
  }

    addUser(user: Object): Observable<any>{
      return this.http.post(`${this.env.apiUrl + this.url}`, user);
    }


    createPosts(user: Object): Observable<any>{
      return this.http.post(`${this.env.apiUrl + this.postCreate}`, user);
    }

    allPostList() {
      const url = `${this.env.apiUrl + this.getPosts}`;
      console.log(this.http.get<any[]>(url));
      return this.http.get<any[]>(url);
    }

    allPostListID(UserId: any) {
      const url = `${this.env.apiUrl + this.getCustomerData}/${UserId}`;
      console.log(this.http.get<any[]>(url));
      return this.http.get<any[]>(url);
    }

    getAllPostId(postID: any) {
      const url = `${this.env.apiUrl + this.getPostDataID}/${postID}`;
      console.log(this.http.get<any[]>(url));
      return this.http.get<any[]>(url);
    }
}
