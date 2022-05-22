import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SignInSignUpModule} from './components/pages/createFrame/sign-in-sign-up.module';
import { PreloaderComponent } from './components/common/preloader/preloader.component';
import { HomePageOneComponent } from './components/pages/home-page-one/home-page-one.component';
import { HomePageTwoComponent } from './components/pages/home-page-two/home-page-two.component';
import { HomePageThreeComponent } from './components/pages/home-page-three/home-page-three.component';
import { FooterStyleOneComponent } from './components/common/footer-style-one/footer-style-one.component';
import { NavbarStyleOneComponent } from './components/common/navbar-style-one/navbar-style-one.component';
import { FooterStyleTwoComponent } from './components/common/footer-style-two/footer-style-two.component';
import { NavbarStyleTwoComponent } from './components/common/navbar-style-two/navbar-style-two.component';
import { AboutComponent } from './components/pages/about/about.component';
import { PricingComponent } from './components/pages/pricing/pricing.component';
import { FaqComponent } from './components/pages/faq/faq.component';
import { DesignerComponent } from './components/pages/designer/designer.component';
import { TestimonialsComponent } from './components/pages/testimonials/testimonials.component';
import { ErrorComponent } from './components/pages/error/error.component';
//import { SignInComponent } from './components/pages/createFrame/sign-in/sign-in.component';
//import { SignUpComponent } from './components/pages/createFrame/sign-up/sign-up.component';
import { RecoverPasswordComponent } from './components/pages/recover-password/recover-password.component';
import { TermsConditionsComponent } from './components/pages/terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from './components/pages/privacy-policy/privacy-policy.component';
import { ComingSoonComponent } from './components/pages/coming-soon/coming-soon.component';
import { ServicesComponent } from './components/pages/services/services.component';
import { ServicesDetailsComponent } from './components/pages/services-details/services-details.component';
import { ProductsComponent } from './components/pages/products/products.component';
import { CartComponent } from './components/pages/cart/cart.component';
import { CheckoutComponent } from './components/pages/checkout/checkout.component';
import { ProductsDetailsComponent } from './components/pages/products-details/products-details.component';
import { BlogComponent } from './components/pages/blog/blog.component';
import { BlogDetailsComponent } from './components/pages/blog-details/blog-details.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { CreatepostComponent } from './components/pages/createpost/createpost.component';


@NgModule({
  declarations: [
    AppComponent,
    PreloaderComponent,
    HomePageOneComponent,
    HomePageTwoComponent,
    HomePageThreeComponent,
    FooterStyleOneComponent,
    NavbarStyleOneComponent,
    FooterStyleTwoComponent,
    NavbarStyleTwoComponent,
    AboutComponent,
    PricingComponent,
    FaqComponent,
    DesignerComponent,
    TestimonialsComponent,
    ErrorComponent,

    RecoverPasswordComponent,
    TermsConditionsComponent,
    PrivacyPolicyComponent,
    ComingSoonComponent,
    ServicesComponent,
    ServicesDetailsComponent,
    ProductsComponent,
    CartComponent,
    CheckoutComponent,
    ProductsDetailsComponent,
    BlogComponent,
    BlogDetailsComponent,
    ContactComponent,
    CreatepostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SignInSignUpModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
