import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PlacementTestComponent } from './placement-test/placement-test.component';
import { CourseDetailesComponent } from './course-detailes/course-detailes.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
    { path: '', component: HomeComponent }, // route for "/"
    { path: 'login', component: LoginComponent }, 
    { path: 'register', component: RegisterComponent }, 
    { path: 'profile', component: ProfileComponent }, 
    { path: 'PlacementTest', component: PlacementTestComponent }, 
    { path: 'courses/:id', component: CourseDetailesComponent }
    // { path: '**', component: NotFoundComponent } //wildcard route (404)

  ];
