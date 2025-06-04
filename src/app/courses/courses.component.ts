import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CardComponent } from "../card/card.component";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-courses',
  imports: [CardComponent, CommonModule, RouterLink],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent implements OnInit {
  constructor(private _HttpClient: HttpClient) { }
  courses: any = []
  ngOnInit(): void {
    this.getCoarses().subscribe({
      next: (res) => {
        // console.log(res);
        this.courses = res
      }
    })

  }

  getCoarses(): Observable<any> {
    return this._HttpClient.get("http://localhost:3000/course/")
  }
}
