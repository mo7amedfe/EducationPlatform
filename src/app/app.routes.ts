import { StudentsAssignmentsComponent } from './students-assignments/students-assignments.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PlacementTestComponent } from './placement-test/placement-test.component';
import { CourseDetailesComponent } from './course-detailes/course-detailes.component';
import { ProfileComponent } from './profile/profile.component';
import { CartComponent } from './cart/cart.component';
import { SubscribedCoursesComponent } from './subscribed-courses/subscribed-courses.component';
import { EnrolledCourseDataComponent } from './enrolled-course-data/enrolled-course-data.component';
import { LandingComponent } from './landing/landing.component';
import { AdminComponent } from './admin/admin.component';
import { CourseFinalTestComponent } from './course-final-test/course-final-test.component';

export const routes: Routes = [
    { path: '', component: LandingComponent  },
    { path: 'home', component: HomeComponent }, // route for "/"
    { path: 'login', component: LoginComponent }, 
    { path: 'register', component: RegisterComponent }, 
    { path: 'profile', component: ProfileComponent }, 
    { path: 'PlacementTest', component: PlacementTestComponent }, 
    { path: 'Cart', component: CartComponent }, 
    { path: 'subscribed-courses', component: SubscribedCoursesComponent }, 
    { path: 'courses/:id', component: CourseDetailesComponent },
    { path: 'subscribed-courses/:id', component: EnrolledCourseDataComponent },
    { path: 'courseFinalTest/:id', component: CourseFinalTestComponent },

    { path: 'admin', component: AdminComponent },
    { path: 'studentsAssignments', component: StudentsAssignmentsComponent }



    // { path: '**', component: NotFoundComponent } //wildcard route (404)

  ];
