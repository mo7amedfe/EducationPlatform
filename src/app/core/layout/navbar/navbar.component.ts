import { AuthService } from './../../services/auth.service';
import { UserService } from './../../services/user.service';
import { CommonModule } from '@angular/common';
import { Component, effect, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {

  @ViewChild('navElement', { static: true }) navElement!: ElementRef;

  get nativeElement(): HTMLElement {
    return this.navElement?.nativeElement;
  }

  getHeight(): number {
    return this.nativeElement?.offsetHeight || 0;
  }

  @ViewChild('navCollapse', { static: true }) navCollapse!: ElementRef;






  isLogin: boolean = false;
  currentRoute: string = '';
  imagePreview: string | ArrayBuffer | null = null;
  user: any = {};
  navs: any[] = [];

  constructor(
    private _AuthService: AuthService,
    private _UserService: UserService,
    private _Router: Router
  ) {
    // Reactively track signals
    effect(() => {
      this.isLogin = this._AuthService.isLogin();
      const role = this._AuthService.role();
      this.setNavsByRole(role);

      // update UI from signals
      this.imagePreview = this._UserService.profileImage();
      this.user.username = this._UserService.name();

      // load profile when logged in
      if (this.isLogin) {
        this.getProfileData();
      } else {
        this.user = {};
        this.imagePreview = null;
      }
    });
  }

  ngOnInit(): void {
    this._AuthService.checkLoginStatus();
    this._Router.events.subscribe(() => {
      this.currentRoute = this._Router.url;
    });
  }

  setNavsByRole(role: string | null) {
    if (role === 'Admin') {
      this.navs = [
        { name: 'Admin', link: '/admin' },
        { name: 'Assignments', link: '/studentsAssignments' },
        { name: 'Courses', link: '/courses' },
      ];
    } else if (role === 'Instructor') {
      this.navs = [
        { name: 'Dashboard', link: '/instructorDashboard' },
        { name: 'Assignments', link: '/studentsAssignments' },
        { name: 'Courses', link: '/courses' },
      ];
    } else if (role === 'Student') {
      this.navs = [
        { name: 'Home', link: '/home' },
        // { name: 'Placement Test', link: '/PlacementTest' },
        { name: 'Cart', link: '/Cart' },
        { name: 'Enrolled Courses', link: '/subscribed-courses' },
      ];
    } else {
      this.navs = [];
    }
  }

  async logout() {
    this._AuthService.setIsLogin(false);
    this._AuthService.setRole(null);
    await localStorage.removeItem('token');
    this._Router.navigate(['/']);

    this.imagePreview = null;
    this.user = {};
    this.navs = [];
    this._UserService.setProfileImage(null);
    this._UserService.setName(undefined);
  }

  login() {
    this._Router.navigate(['/login']);
  }

  register() {
    this._Router.navigate(['/register']);
  }

  getProfileData() {
    this._UserService.getProfile().subscribe({
      next: (res) => {
        this._UserService.setScore(res.user.score);
        this._UserService.setProfileImage(res.user.profile_pic.secure_url);
        this._UserService.setName(res.user.username);
        this._UserService.setEmail(res.user.email);
        this.imagePreview = this._UserService.profileImage();
        this.user.username = this._UserService.name();

        
      },
      error: (err) => {
        console.error('Failed to load profile data', err);
      },
    });
  }
}
