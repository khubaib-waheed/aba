import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { HomeComponent } from './pages/home/home.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { ContactComponent } from './pages/contact/contact.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { AuctionListComponent } from './pages/auction-list/auction-list.component';
import { NewCarsComponent } from './pages/new-cars/new-cars.component';
import { BidDetailComponent } from './pages/bid-detail/bid-detail.component';
import { UserInformationComponent } from './pages/user-information/side-menu/user-information.component';
import { ProfileComponent } from './pages/user-information/profile/profile.component';
import { ChatComponent } from './pages/user-information/chat/chat.component';
import { AdsComponent } from './pages/user-information/ads/ads.component';
import { BidsComponent } from './pages/user-information/bids/bids.component';
import { FavouritesComponent } from './pages/user-information/favourites/favourites.component';
import { WalletComponent } from './pages/user-information/wallet/wallet.component';
import { SecretQuestionComponent } from './pages/secret-question/secret-question.component';
import { SubscriptionComponent } from './pages/verification/subscription/subscription.component';
import { BusinessComponent } from './pages/verification/business/business.component';
import { DocumentsComponent } from './pages/verification/documents/documents.component';
import { AddressComponent } from './pages/verification/address/address.component';
import { ProcessComponent } from './pages/verification/process/process.component';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
    // {
    //     path: 'app',
    //     component: HomeComponent, // Routes with header & footer
    //     children: [
    //       { path: '', redirectTo: 'home', pathMatch: 'full' },
    //       { path: 'home', component: LandingPageComponent },
    //       // { path: 'contact', component: ContactComponent, canActivate: [authGuard] },
    //       { path: 'contact', component: ContactComponent },
    //       { path: 'new-cars', component: NewCarsComponent },
    //       { path: 'auction-list', component: AuctionListComponent },
    //       { path: 'bid-detail/:id', component: BidDetailComponent },
    //       { 
    //         path: 'user-information', 
    //         component: UserInformationComponent, 
    //         children: [
    //           { path: 'profile', component: ProfileComponent },
    //           { path: 'chat', component: ChatComponent },
    //           { path: 'ads', component: AdsComponent },
    //           { path: 'bids', component: BidsComponent },
    //           { path: 'favourites', component: FavouritesComponent },
    //           { path: 'wallet', component: WalletComponent },
    //         ]
    //       }
    //     ]
    // },
    // {
    //     path: 'auth',
    //     component: AuthComponent, // Routes without header & footer
    //     children: [
    //       { path: 'sign-in', component: SignInComponent },
    //       { path: 'sign-up', component: SignUpComponent },
    //       { path: 'secret-question', component: SecretQuestionComponent },
    //       { 
    //         path: 'verification', 
    //         component: ProcessComponent,
    //         children: [
    //           { path: 'address', component: AddressComponent },
    //           { path: 'documents', component: DocumentsComponent },
    //           { path: 'business', component: BusinessComponent },
    //           { path: 'subscription', component: SubscriptionComponent },
    //         ]
    //        },
    //     ]
    // },
    // { path: '', redirectTo: 'app/home', pathMatch: 'full' },
    // { path: '**', redirectTo: 'app/home' } // Handle unknown routes
];
