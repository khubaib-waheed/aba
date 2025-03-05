import { Routes } from '@angular/router';
import { ContactComponent } from './pages/contact/contact.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthComponent } from './pages/auth/auth.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';

export const routes: Routes = [
    // {
    //     path: '',
    //     component: HomeComponent, // Routes with header & footer
    //     children: [
    //       { path: '', redirectTo: 'home', pathMatch: 'full' },
    //       { path: 'home', component: LandingPageComponent },
    //       { path: 'contact', component: ContactComponent }
    //     ]
    // },
    // {
    //     path: '',
    //     component: AuthComponent, // Routes without header & footer
    //     children: [
    //       { path: 'sign-in', component: SignInComponent },
    //     ]
    // },
    // { path: '', redirectTo: 'home', pathMatch: 'full' },
    // { path: '**', redirectTo: 'home' } // Handle unknown routes
];
