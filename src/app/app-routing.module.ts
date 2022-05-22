import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageOneComponent } from './components/pages/home-page-one/home-page-one.component';
import { HomePageTwoComponent } from './components/pages/home-page-two/home-page-two.component';
import { HomePageThreeComponent } from './components/pages/home-page-three/home-page-three.component';
import { AboutComponent } from './components/pages/about/about.component';
import { PricingComponent } from './components/pages/pricing/pricing.component';
import { FaqComponent } from './components/pages/faq/faq.component';
import { DesignerComponent } from './components/pages/designer/designer.component';
import { TestimonialsComponent } from './components/pages/testimonials/testimonials.component';
import { ErrorComponent } from './components/pages/error/error.component';
import { SignInComponent } from './components/pages/createFrame/sign-in/sign-in.component';
import { SignUpComponent } from './components/pages/createFrame/sign-up/sign-up.component';
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
import {CreatepostComponent} from './components/pages/createpost/createpost.component';
import {AuthGuard} from './guards/auth.guard';

const routes: Routes = [
    {path: 'home-two', component: HomePageOneComponent},
    {path: '', component: HomePageTwoComponent},
    {path: 'home-three', component: HomePageThreeComponent},
    {path: 'about', component: AboutComponent},
    {path: 'pricing', component: PricingComponent},
    {path: 'faq', component: FaqComponent},
    {path: 'designer', component: DesignerComponent},
    {path: 'testimonials', component: TestimonialsComponent},
    {path: 'error', component: ErrorComponent},
    {path: 'sign-in', component: SignInComponent},
    {path: 'sign-up', component: SignUpComponent},
    {path: 'recover-password', component: RecoverPasswordComponent},
    {path: 'terms-condition', component: TermsConditionsComponent},
    {path: 'privacy-policy', component: PrivacyPolicyComponent},
    {path: 'coming-soon', component: ComingSoonComponent},
    {path: 'services', component: ServicesComponent},
    {path: 'service-details', component: ServicesDetailsComponent},
    {path: 'product', component: ProductsComponent},
    {path: 'cart', component: CartComponent},
    {path: 'checkout', component: CheckoutComponent},
    {path: 'product-details', component: ProductsDetailsComponent},
    {path: 'blog', component: BlogComponent},
    {path: 'blog-details', component: BlogDetailsComponent},
    {path: 'contact', component: ContactComponent},
    {path: 'create-post', component: CreatepostComponent},
    {path: '**', component: ErrorComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }