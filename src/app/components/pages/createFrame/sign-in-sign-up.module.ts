import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ServicesService} from '../../all-common/allServices';
import {SignInComponent} from './sign-in';
import {SignUpComponent} from './sign-up';
import {FramesRoutingModule} from './frames-routing.module';


@NgModule({
  declarations: [SignInComponent, SignUpComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FramesRoutingModule
  ],
  providers: [
    ServicesService,
  ]
})
export class SignInSignUpModule { }
