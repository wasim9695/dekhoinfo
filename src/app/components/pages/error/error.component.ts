import { Component, OnInit } from '@angular/core';
import {ServicesService} from '../../all-common/allServices';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  constructor(private userService: ServicesService) { }

  ngOnInit(): void {
    this.userService.logout();
  }

}
