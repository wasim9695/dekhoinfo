import { Component, OnInit } from '@angular/core';
import { allModel } from '../../all-common/allModels';
import {ServicesService} from '../../all-common/allServices';
import {SubSink} from '../../all-common/Unsubscribe-adapter';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent extends SubSink  implements OnInit {

  public postData: any = new allModel();
  constructor(private userService: ServicesService,
    private router: Router) {super(); }

  ngOnInit(): void {
   //alert(localStorage.getItem('currentUser'));
   this.getAllPost();
   
  }
  getAllPost(){ 
    this.userService.allPostList()
       .subscribe(
           data => {
             this.postData=data;
             //console.log(this.postData);
             this.postData= data;
             
             console.log(this.postData);
             
             //this.getDataId();
                //console.log(data);

               //  started from data in this here

              
                 
           },
           error => {

           });
         }

detailPage(Id){
console.log(Id);
//return false;
localStorage.setItem("Id", Id);
this.router.navigate(['/blog-details']);

}

}
