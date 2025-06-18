
import { NavbarComponent } from './navbar/navbar.component';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet,Router } from '@angular/router';
import { FooterComponent } from './footer/footer.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'mostafaproj';

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
