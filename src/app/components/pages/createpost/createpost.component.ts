import {
  Component,
  EventEmitter,
  OnInit,
  OnDestroy,
  Output
} from '@angular/core';
import {staticData} from './sharedfile';
import {cretePostModel} from './sharedfile';
import {ServicesService} from '../../all-common/allServices';
import {SubSink} from '../../all-common/Unsubscribe-adapter';
import { Router, ActivatedRoute } from '@angular/router';
declare let $: any;

@Component({
  selector: 'app-createpost',
  templateUrl: './createpost.component.html',
  styleUrls: ['./createpost.component.scss']
})
export class CreatepostComponent extends SubSink  implements OnInit {
public StaticData = new staticData();
public CretePostModel = new cretePostModel();
staticDataAll:any;
private route: ActivatedRoute;
userID: any;
returnUrl: string;
fileName: string;
tabIndex = 0;
  constructor(private router: Router,
    private userService: ServicesService) { super();
        }

  ngOnInit(): void {
  this.CretePostModel.Categories = 'other';
    this.staticDataAll=this.StaticData;
    this.userID = localStorage.getItem('currentUser');
    const employeeData = JSON.parse(this.userID);
     //console.log(employeeData.data[0].Name);
     this.userID = employeeData.data[0].Id;
     
  }
 

  onFileChange(event) {
  
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
    console.log(file);
    if (file) {
      var formData:any = new FormData();
      formData.append('file', file.value);
      console.log(formData);
    }
  }
}


  createPosts(event){
this.CretePostModel.CustomerId =  this.userID;
const employeeData = JSON.parse(localStorage.getItem('currentUser'));
this.CretePostModel.Name =  employeeData.data[0].Name;
console.log(this.CretePostModel);
//return false;
this.userService.createPosts(this.CretePostModel)
.subscribe(
    data => {
      if(data.status===false){
        alert(data.message);
        return false;
      }else{
       this.router.navigate(['/blog']);
      }
    },
    error => {
    });
  }

}
