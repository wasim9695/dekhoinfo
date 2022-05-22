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
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent extends SubSink  implements OnInit {
  public user = new allModel();
  registerForm: FormGroup;
    submitted = false;
    returnUrl: string;
    error = '';
    loading = false;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: ServicesService) { 
    super();
   }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      Name: ['', Validators.required],
      Email: ['', Validators.required],
      Password: ['', Validators.required]
  });
  this.userService.logout();
  // get return url from route parameters or default to '/'
  this.returnUrl = this.route.snapshot.queryParams['/'] || '/';
  }
  // saveUser() {
  //   console.log("user information" + JSON.stringify(this.user));
  //   // this.subs.add(this.user).subscribe(data => {
 
  //   // });
  // }
  get f() { return this.registerForm.controls; }


 

  onSubmit() {
      this.submitted = true;

      // reset alerts on submit
  

      // stop here if form is invalid
      if (this.registerForm.invalid) {
          return;
      }

      this.loading = true;
      this.userService.addUser(this.registerForm.value)
          .pipe(first())
          .subscribe(
              data => {
                   console.log(data);
                if(data.status===false){
                  alert(data.message);
                  return false;
                }else{
                  localStorage.setItem('currentUser', JSON.stringify(this.user));
                 this.router.navigate([this.returnUrl]);
                }
              },
              error => {
                this.loading = false;
                this.error = 'wrong credentials';
              });
  }
  

  
 

}

