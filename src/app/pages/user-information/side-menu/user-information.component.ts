import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-user-information',
  imports: [RouterModule],
  templateUrl: './user-information.component.html',
  styleUrl: './user-information.component.scss'
})
export class UserInformationComponent implements OnInit {
  activeMenu: string = 'profile'; // Default active menu
  private unsubscribe$ = new Subject<void>(); // Used for cleanup

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object, 
    private router: Router,
    private authService: AuthService,
    private toast: HotToastService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.setCurrentRoute();

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(() => this.setCurrentRoute());
  }

  setCurrentRoute() {
    let activeRoute = this.activatedRoute;
    while (activeRoute.firstChild) {
      activeRoute = activeRoute.firstChild;
    }
    this.activeMenu = activeRoute.snapshot.url.map(seg => seg.path).join('/');
    console.log('Detected Route:', this.activeMenu);
  }

  setActiveMenu(menu: string) {
    this.activeMenu = menu;
    this.onScrollToTop()
  }

  onScrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }








  changePage(s: any) {
    return
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        if (isPlatformBrowser(this.platformId)) {
          sessionStorage.clear();
        }
       
        this.router.navigate(['/auth/sign-in']);
      },
      error: err => {
       this.toast.error(err.error.Message);
      }
    })
  }

  ngOnDestroy() {
    this.unsubscribe$.next();  // Notify all subscriptions to stop
    this.unsubscribe$.complete(); // Complete the subject to free resources
  }
}
