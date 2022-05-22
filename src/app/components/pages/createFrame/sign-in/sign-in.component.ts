import {
  Component,
  EventEmitter,
  OnInit,
  OnDestroy,
  Output
} from '@angular/core';
import {allModel} from '../../../all-common/allModels';
import {ServicesService} from '../../../all-common/allServices';
import {SubSink} from '../../../all-common/Unsubscribe-adapter';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent extends SubSink  implements OnInit {
  public user = new allModel();
  loginForm: FormGroup;
    submitted = false;
    returnUrl: string;
    error = '';
    loading = false;
    ErrorMsg: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: ServicesService) { 
    super();
   }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      Email: ['', Validators.required],
      Password: ['', Validators.required]
  });
  //this.userService.logout();
  // get return url from route parameters or default to '/'
  this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  //alert(localStorage.getItem('currentUser'));
  }
  // saveUser() {
  //   console.log("user information" + JSON.stringify(this.user));
  //   // this.subs.add(this.user).subscribe(data => {
 
  //   // });
  // }
  get f() { return this.loginForm.controls; }

  onSubmit() {
      this.submitted = true;

      // reset alerts on submit
  

      // stop here if form is invalid
      if (this.loginForm.invalid) {
          return;
      }

      this.loading = true;
      this.userService.login(this.f.Email.value, this.f.Password.value)
          .pipe(first())
          .subscribe(
              data => {
                   console.log(data);
                if(data.status===false){
                  this.ErrorMsg = true;
                  return false;
                }else{
                 localStorage.getItem('currentUser');

                 this.router.navigate([this.returnUrl])
                 .then(() => {
                  window.location.reload();
                });
             
                }
              },
              error => {
                this.loading = false;
                this.ErrorMsg = true;
              });
  }
  

  
 

}
