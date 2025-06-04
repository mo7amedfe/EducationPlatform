import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseDataService } from '../course-data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-enrolled-course-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './enrolled-course-data.component.html',
  styleUrl: './enrolled-course-data.component.css'
})
export class EnrolledCourseDataComponent implements OnInit {
  courseId: string = '';
  courseData: any = {
    courseName: '',
    courseDescription: '',
    courseImage: { secure_url: '' },
    courselessons: []
  };
  selectedLesson: any = null;

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _CourseDataService: CourseDataService
  ) {}

  ngOnInit(): void {
    this.courseId = this._ActivatedRoute.snapshot.params['id'];
    this._CourseDataService.getCourseData(this.courseId).subscribe((res) => {
      console.log(res);
      this.courseData = res;
      if (this.courseData.courselessons.length > 0) {
        this.selectedLesson = this.courseData.courselessons[0];
      }
    });
  }

  selectLesson(lesson: any) {
    this.selectedLesson = lesson;
  }
}
