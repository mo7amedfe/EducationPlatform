import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-courses',
  imports: [CardComponent, CommonModule, RouterLink ],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent implements OnInit {
  constructor(private _HttpClient: HttpClient) { }
  courses: any = []
  isLoading:boolean = true;

  ngOnInit(): void {
    this.isLoading = true;
    this.getCoarses().subscribe({
      next: (res) => {
        // console.log(res);
        this.courses = res
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    })
  }

  getCoarses(): Observable<any> {
    return this._HttpClient.get("http://localhost:3000/course/")
  }
}
