
import { Component } from '@angular/core';
import { AllUsersComponent } from './all-users/all-users.component';
import { AddCourseComponent } from './add-course/add-course.component';
import { AddLessonComponent } from './add-lesson/add-lesson.component';
import { AddCourseFinalTestComponent } from './add-course-final-test/add-course-final-test.component';
import { DeleteCourseComponent } from './delete-course/delete-course.component';


@Component({
  selector: 'app-admin',
  imports: [ AllUsersComponent, AddCourseComponent, AddLessonComponent, AddCourseFinalTestComponent, DeleteCourseComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {

}
