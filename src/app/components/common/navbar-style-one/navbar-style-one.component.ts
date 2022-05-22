import { Component, OnInit } from '@angular/core';
import {ServicesService} from '../../all-common/allServices';
import {Router} from '@angular/router';
@Component({
  selector: 'app-navbar-style-one',
  templateUrl: './navbar-style-one.component.html',
  styleUrls: ['./navbar-style-one.component.scss']
})
export class NavbarStyleOneComponent implements OnInit {
  userName: any;
  constructor(private userService: ServicesService,
    private router: Router) { }

  ngOnInit(): void {
   this.userName = localStorage.getItem('currentUser');
   const employeeData = JSON.parse(this.userName);
    //console.log(employeeData.data[0].Name);
    this.userName = employeeData.data[0].Name;


  }
  
  logout(){
  this.userService.logout();
  this.router.navigate(['/'])
  .then(() => {
   window.location.reload();
  });
}
}
