import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class EnvService {

  //api for local
 /* public apiUrl = 'https://localhost:8443/rest';
  public wssUrl = 'wss://localhost:8443/ws';*/

  // api url for cloud
  //public apiUrl = 'http://localhost:4200/rest';
 // public wssUrl = 'wss://134.209.159.96/rest/ws';
 apiUrl = 'http://localhost:9229';
 //wssUrl = 'ws://localhost:4200/rest/ws';
  // Whether or not to enable debug mode
  public enableDebug = true;

  constructor() {
  }
}
