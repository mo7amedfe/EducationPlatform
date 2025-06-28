import { AuthService } from './../../core/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
    this._HttpClient
      .get('http://localhost:3000/order/enrolled-courses', { headers })
      .subscribe({
        next: (res: any) => {
          console.log(res);
          
          this.isLoading = false;
          // Sort courses from Saturday to Friday, then by time
          const dayOrder = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
          this.courses = res.courses.sort((a: any, b: any) => {
            const dayDiff = dayOrder.indexOf(a.selectedSchedule.day) - dayOrder.indexOf(b.selectedSchedule.day);
            if (dayDiff !== 0) return dayDiff;
            // If same day, order by time
            return new Date('1970/01/01 ' + a.selectedSchedule.time).getTime() -
                   new Date('1970/01/01 ' + b.selectedSchedule.time).getTime();
          });
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  navigateToCourseDetails(courseId: string) {
    this._Router.navigate([`/subscribed-courses/${courseId}`]);
  }
}
