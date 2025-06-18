import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Token } from '@angular/compiler';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-final-test-feedbacks',
  imports: [CommonModule,FormsModule],

  templateUrl: './final-test-feedbacks.component.html',
  styleUrl: './final-test-feedbacks.component.css'
})
export class FinalTestFeedbacksComponent implements OnInit {
 constructor(private _HttpClient:HttpClient) { }
  ngOnInit(): void {
   const Token= localStorage.getItem('token') || '';
    const headers = { 'Authorization': `Bearer ${Token}` };
this._HttpClient.get('http://localhost:3000/finalTest/feedback', { headers }).subscribe({
  next: (res: any) => {
    console.log(res);
    this.assignmentFeedbacks = res.submissions || [];
  }
})
  }
  assignmentFeedbacks:any[] = [];

  selectedCourse: string = '';

  get courses() {
    return [...new Set(this.assignmentFeedbacks.map(f => f.courseName))];
  }

  get filteredFeedbacks() {
    if (!this.selectedCourse) return this.assignmentFeedbacks;
    return this.assignmentFeedbacks.filter(f => f.courseName === this.selectedCourse);
  }
}

