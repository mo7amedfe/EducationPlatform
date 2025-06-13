import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-subscribed-courses',
  imports: [CommonModule, RouterModule],
  templateUrl: './subscribed-courses.component.html',
  styleUrl: './subscribed-courses.component.css',
})
export class SubscribedCoursesComponent implements OnInit {
  courses: any[] = [];
isLoading: boolean = false;

  constructor(
    private _HttpClient: HttpClient,
    private _AuthService: AuthService,
    private _Router: Router
  ) {}


  ngOnInit(): void {
    this.isLoading = true;
    const token = this._AuthService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this._HttpClient.get('http://localhost:3000/order/enrolled-courses', { headers })
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          this.courses = res.courses;
        },
        error:(err)=> {
            console.log(err);  
        },
      });
  }
  
  navigateToCourseDetails(courseId: string) {

    this._Router.navigate([`/subscribed-courses/${courseId}` ]);
  }
}
