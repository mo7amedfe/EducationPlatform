import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { LandingComponent } from "../../../features/landing/landing.component";
import { FooterComponent } from "../footer/footer.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [NavbarComponent, RouterOutlet, FooterComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

}
