import { Component, OnInit } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-courses',
  imports: [CardComponent, CommonModule, RouterLink ],
  templateUrl: './admin-courses.component.html',
  styleUrl: './admin-courses.component.css',
})
export class AdminCoursesComponent implements OnInit {
  constructor(private _HttpClient: HttpClient) {}
  courses: any = [];
  isLoading: boolean = true;

  ngOnInit(): void {
    this.isLoading = true;
    this.getCoarses().subscribe({
      next: (res:any) => {
        // console.log(res);
        this.courses = res;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  getCoarses(): Observable<any> {
    return this._HttpClient.get('http://localhost:3000/course/');
  }
}
