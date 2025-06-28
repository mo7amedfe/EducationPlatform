import { AuthService } from './../../services/auth.service';
import { UserService } from './../../services/user.service';
import { CommonModule } from '@angular/common';

import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  isLogin: boolean = false;
  currentRoute: string = '';

  navs = [
    { name: 'Home', link: '/home' },
    {
      name: 'Placement Test',
      link: '/PlacementTest',
    },
    {
      name: 'Cart',
      link: '/Cart',
    },
    {
      name: 'Subscribed Courses',
      link: '/subscribed-courses',
    },
    {
      name: 'Admin',
      link: '/admin',
    },
    {
      name: 'Students Assignments',
      link: '/studentsAssignments',
    },
  ];

  constructor(
    private _AuthService: AuthService,
    private _UserService: UserService,
    private _Router: Router
  ) {}
  user: any = {};
  imagePreview: string | ArrayBuffer | null = null;

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    this._AuthService.checkLoginStatus(); // أول حاجة، شوف هو لوج إن ولا لا

    this._AuthService.isLogin$.subscribe((state) => {
      this.isLogin = state;

      if (state) {
        this.navs = [
          {
            name: 'Home',
            link: '/home',
          },
          {
            name: 'Placement Test',
            link: '/PlacementTest',
          },
          {
            name: 'Cart',
            link: '/Cart',
          },
          {
            name: 'Subscribed Courses',
            link: '/subscribed-courses',
          },
        ];
        this._AuthService.isAdmin$.subscribe((state) => {
          if (state) {
            this.navs = [
              {
                name: 'Admin',
                link: '/admin',
              },
              {
                name: 'Students Assignments',
                link: '/studentsAssignments',
              },{
                name: 'Courses',
                link: '/courses',
              }
            ]
            this._Router.navigate(['admin'])
          } else {
            this.navs = this.navs.filter((nav) => nav.name !== 'Admin');
          }
        });
        const decodedToken = this._AuthService.getDecodedToken();
        this.user = decodedToken;
        this._UserService.getProfile().subscribe({
          next: (res) => {
            // console.log(res);
            this._UserService.setScore(res.user.score);
            this._UserService.setProfileImage(res.user.profile_pic.secure_url);
            this._UserService.setname(res.user.userName);
            this._UserService.setEmail(res.user.email);

            this._UserService.$profileImage.subscribe((url) => {
              this.imagePreview = url;
            });
            this._UserService.$name.subscribe((name) => {
              if (name) {
                this.user.username = name;
              }
            });
          },
        });
      } else {
        this.user = {};
        this.navs = [
          {
            name: 'Home',
            link: '/home',
          },
        ];
      }
    });

    this._Router.events.subscribe(() => {
      this.currentRoute = this._Router.url;
    });
  }

  async logout() {
    // this.isLogin = false
    this._AuthService.setIsLogin(false);
    await localStorage.removeItem('token');
    this._Router.navigate(['/']);
  }
  login() {
    this._Router.navigate(['/login']);
  }
  register() {
    this._Router.navigate(['/register']);
  }
}
