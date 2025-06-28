import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LandingComponent } from "./features/landing/landing.component";
import { FooterComponent } from "./core/layout/footer/footer.component";
import { NavbarComponent } from "./core/layout/navbar/navbar.component";
import { MainLayoutComponent } from "./core/layout/main-layout/main-layout.component";


@Component({
  selector: 'app-root',
  imports: [MainLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Frontend2';
  
  constructor(private _router: Router) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    const currentUrl = this._router.url;

    if (token && currentUrl === '/') {
      this._router.navigate(['/home']);
    } else if (!token && currentUrl !== '/') {
      this._router.navigate(['/']);
    }
    }
  }
}
