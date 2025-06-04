import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscribed-courses',
  imports: [CommonModule],
  templateUrl: './subscribed-courses.component.html',
  styleUrl: './subscribed-courses.component.css',
})
export class SubscribedCoursesComponent implements OnInit {
  courses: any[] = [];

  constructor(
    private _HttpClient: HttpClient,
    private _AuthService: AuthService,
    private _Router: Router
  ) {}

  navigateToCourseDetails(courseId: string) {
    console.log(courseId);
    this._Router.navigate(['/subscribed-courses', courseId]);
  }

  ngOnInit(): void {
    const token = this._AuthService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this._HttpClient
      .get('http://localhost:3000/order/enrolled-courses', {headers})
      .subscribe({
        next: (res: any) => {
          this.courses = res.courses;
          console.log(this.courses);
        },
      });
  }
}
