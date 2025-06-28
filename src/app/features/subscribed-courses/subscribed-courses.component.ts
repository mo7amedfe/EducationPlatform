import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CoursesService } from '../../core/services/courses.service';

@Component({
  selector: 'app-subscribed-courses',
  imports: [CommonModule, RouterModule],
  templateUrl: './subscribed-courses.component.html',
  styleUrl: './subscribed-courses.component.css',
})
export class SubscribedCoursesComponent implements OnInit {
  courses: any[] = [];
  isLoading: boolean = false;


    private _Router=inject(Router)
    private _CoursesService=inject(CoursesService)



  ngOnInit(): void {
    this.isLoading = true;
    
    this._CoursesService.getSubscribedCourses()
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
