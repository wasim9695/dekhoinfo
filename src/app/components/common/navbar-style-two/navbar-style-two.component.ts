import { Component, OnInit } from '@angular/core';
import {ServicesService} from '../../all-common/allServices';

@Component({
  selector: 'app-navbar-style-two',
  templateUrl: './navbar-style-two.component.html',
  styleUrls: ['./navbar-style-two.component.scss']
})
export class NavbarStyleTwoComponent implements OnInit {

  constructor(private userService: ServicesService) { }

  ngOnInit(): void {
    this.userService.logout();
  }


}
