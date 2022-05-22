import { Component, OnInit } from '@angular/core';
import { allModel } from '../../all-common/allModels';
import {ServicesService} from '../../all-common/allServices';
import {SubSink} from '../../all-common/Unsubscribe-adapter';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home-page-two',
  templateUrl: './home-page-two.component.html',
  styleUrls: ['./home-page-two.component.scss']
})
export class HomePageTwoComponent extends SubSink  implements OnInit {
public postData: any = new allModel();
  constructor(private userService: ServicesService,
    private router: Router) {super(); }

  ngOnInit(): void {
   //alert(localStorage.getItem('currentUser'));
   this.getAllPost();
   
  }


  getDataId(userID){
   this.userService.allPostListID(userID)
   .subscribe(
       data => {
         //this.postData = data['data'];
        // this.postData.push(data['data']);
        //console.log("hello", this.postData[22].Name);
        
         
            //console.log(data);
       },
       error => {

       });
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
