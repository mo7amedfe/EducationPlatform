import { AdminService } from './../../../services/admin.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
@Component({
  selector: 'app-all-users',
  imports: [CommonModule],
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.css'
})
export class AllUsersComponent {

  private _AdminService=inject(AdminService)
  
  allUsers: any[] = [];
  Token: any;
  isUsersLoading = false; // <-- Added loading indicator for users
  notificationMessage: string = '';
  IsNotificationVisible: boolean = false;
  isNotificationSuccess: boolean = false;


  ngOnInit(): void {
    this.isUsersLoading =true
    this._AdminService.getAllUsers().subscribe({
      next: (response:any) => {
        this.allUsers = response.allUsers;
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
 
  DeleteUser(user: any) {
        let body= { userId: user._id }
        this._AdminService.DeleteUser(body).subscribe({
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
