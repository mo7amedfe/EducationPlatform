import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
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
export class MainLayoutComponent implements AfterViewInit {
  @ViewChild('navbar', { read: ElementRef }) navbarRef!: ElementRef;
  navbarHeight: number = 0;

  ngAfterViewInit(): void {
    this.navbarHeight = this.navbarRef.nativeElement.offsetHeight;
  }
}