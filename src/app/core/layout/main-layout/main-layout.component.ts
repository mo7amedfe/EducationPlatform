import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
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
export class MainLayoutComponent implements AfterViewInit, OnDestroy {
  @ViewChild('navbar') navbarComponent!: NavbarComponent;

  navbarHeight: number = 0;
  resizeObserver!: ResizeObserver;

  ngAfterViewInit(): void {
    this.updateNavbarHeight(); // initial
    this.observeNavbarResize();
  }

  updateNavbarHeight() {
    this.navbarHeight = this.navbarComponent.getHeight();
  }

  observeNavbarResize() {
    const navEl = this.navbarComponent.nativeElement;
    const collapseEl = this.navbarComponent.navCollapse.nativeElement;
  
    // Resize observer
    this.resizeObserver = new ResizeObserver(() => {
      this.updateNavbarHeight();
    });
  
    this.resizeObserver.observe(navEl);
  
    // Listen to collapse close (Bootstrap event)
    collapseEl.addEventListener('hidden.bs.collapse', () => {
      this.updateNavbarHeight();
    });
  }
  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}