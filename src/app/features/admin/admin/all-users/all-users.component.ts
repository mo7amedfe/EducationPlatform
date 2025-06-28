import { AuthService } from './../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import {
  Observable,

} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-all-users',
  imports: [CommonModule],
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.css'
})
export class AllUsersComponent {
  constructor(private _AuthService:AuthService, private _HttpClient:HttpClient){}
  allUsers: any[] = [];
  Token: any;
  isUsersLoading = false; // <-- Added loading indicator for users
  notificationMessage: string = '';
  IsNotificationVisible: boolean = false;
  isNotificationSuccess: boolean = false;


  ngOnInit(): void {
    this.Token = this._AuthService.getToken();

    this.getAllUsers().subscribe({
      next: (response:any) => {
        this.allUsers = response.allUsers; // Store users for the table
        this.isUsersLoading = false; 
        
      },
      error: (error:any) => {
        this.isUsersLoading = false; 
        console.error('Error fetching users:', error);
        this.notificationMessage = 'Error fetching users.';
        this.isNotificationSuccess = false;
        this.IsNotificationVisible = true;
        setTimeout(() => {
          this.IsNotificationVisible = false;
        }, 3000);
      },
    });
  }
  getAllUsers(): Observable<any> {
    this.isUsersLoading =true
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.Token}`
    );
    return this._HttpClient.get('http://localhost:3000/user/allUsers', {
      headers,
    });
  }
  DeleteUser(user: any) {
    const headers = { Authorization: `Bearer ${this.Token}` };
    return this._HttpClient
      .delete('http://localhost:3000/user/deleteUser', {
        body: { userId: user._id },
        headers,
      })
      .subscribe({
        next: (response) => {
          this.notificationMessage = 'User deleted successfully!';
          this.isNotificationSuccess = true;
          this.IsNotificationVisible = true;
          setTimeout(() => {
            this.IsNotificationVisible = false;
          }, 3000);
          this.allUsers = this.allUsers.filter((item) => item !== user);
        },
        error: (error) => {
          this.notificationMessage = 'Error deleting user.';
          this.isNotificationSuccess = false;
          this.IsNotificationVisible = true;
          setTimeout(() => {
            this.IsNotificationVisible = false;
          }, 3000);
        },
      });
  }

}
