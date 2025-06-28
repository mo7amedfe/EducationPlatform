import { CoursesService } from './../../core/services/courses.service';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-courses',
  imports: [CardComponent, CommonModule, RouterLink ],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent implements OnInit {

  private _CoursesService=inject(CoursesService)

  courses: any = []
  isLoading:boolean = true;


  ngOnInit(): void {
    this.isLoading = true;
    this._CoursesService.getAllcourses().subscribe({
      next: (res) => {
        this.courses = res
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    })
  }
}
