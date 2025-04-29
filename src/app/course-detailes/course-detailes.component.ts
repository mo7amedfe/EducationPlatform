import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-course-detailes',
  imports: [],
  templateUrl: './course-detailes.component.html',
  styleUrl: './course-detailes.component.css'
})
export class CourseDetailesComponent implements OnInit {

  courses: any;
  course: any = {}
  id: any;

  constructor(private route: ActivatedRoute, private _HttpClient: HttpClient) { }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.id = idParam;

    }

    this._HttpClient.get('http://localhost:3000/course/').subscribe({
      next: (res) => {
        this.courses = res
      this.course = this.courses.find((c:any) => c._id === this.id);

      }
    })



  }

}
