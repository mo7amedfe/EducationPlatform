import { UserService } from './../../core/services/user.service';
import { AuthService } from './../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-placement-test',
  imports: [CommonModule, FormsModule],
  templateUrl: './placement-test.component.html',
  styleUrl: './placement-test.component.css'
})
export class PlacementTestComponent implements OnInit {
  constructor(private _HttpClient: HttpClient, private _AuthService: AuthService, private _UserService: UserService) { }

  questions: any;
  UserId: any
  selectedOption: string = '';
  submitted: boolean = false;
  answers = {
    student_id: "",
    answers: [] as { id: number, answer: string }[]
  };
  isSubmitted: boolean = false;
  isSubmittedBefore: boolean = false;

  score: number | undefined;

  ngOnInit(): void {
    this._UserService.$score.subscribe(
      (state) => {
        console.log(state);
        if (state !== undefined) {
          this.isSubmitted = true;
          this.isSubmittedBefore = true;
        }else if(state===undefined ){
          this.getQuestions().subscribe({
            next: (res) => {
              if (res.questions) {
                this.questions = res.questions;
              }
            }
      
          })
        }
      }
    )

    this.getId()




  }

  
  getQuestions(): Observable<any> {
    return this._HttpClient.get(`http://localhost:3000/PT/show`)
  }
  // allQuestionsAnswered(): boolean {
  //   return this.questions.every(q => q.selectedAnswer);
  // }
  getId() {
    const decodedToken = this._AuthService.getDecodedToken();
    if (decodedToken) {
      this.UserId = decodedToken._id;
    }
  }

  submitAnswer() {
    this.answers.student_id = this.UserId
    this.answers.answers = this.questions.map((q: any) => ({
      id: q.id,
      answer: q.selectedAnswer
    }));

    this._HttpClient.post(`http://localhost:3000/PT/submit`, this.answers).subscribe({
      next: (res: any) => {
        this.score = res.score;
        this.isSubmitted = true;
        this._UserService.setScore(this.score)
        this.isSubmittedBefore = false;
      },
      error: (err) => {
        console.error('Submission failed:', err);
      }
    });
  }
  allAnswered(): boolean {

    return this.questions.every((q: any) => q.selectedAnswer && q.selectedAnswer !== '');
  }




}