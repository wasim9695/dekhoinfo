import { Component, OnInit } from '@angular/core';
import {cretePostModel} from '../createpost/sharedfile';
import {ServicesService} from '../../all-common/allServices';
import {SubSink} from '../../all-common/Unsubscribe-adapter';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss']
})
export class BlogDetailsComponent extends SubSink  implements OnInit {
  public CretePostModel: any = new cretePostModel();
  constructor(private userService: ServicesService) { super(); }

  ngOnInit(): void {
    //console.log(localStorage.getItem('Id'));
    this.getAllPostId();
  }

  getAllPostId(){
    this.userService.getAllPostId(localStorage.getItem('Id'))
.subscribe(
    data => {
      this.CretePostModel = data;
      console.log(this.CretePostModel);
    },
    error => {
    });
  }

}
