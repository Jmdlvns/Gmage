import { Component, inject } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import Swal from 'sweetalert2';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DataService } from '../data.service';

export interface Status {
  status: {
    message: string;
  };
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule],
  providers: [CookieService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})

export class LoginComponent {
  username:any
  response: any;
  message: any;
Error: any;
test:any;
userDetails: any;
studentList: any = [];
  cookieService = inject(CookieService);
  constructor(private ds: DataService, private route: Router) {}

  ngOnInit(): void {
      this.userDetails = JSON.parse(this.cookieService.get('user_details'));
    }

  applyForm = new FormGroup({
    username: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
  });
    Login() {
      this.ds.sendRequestWithoutMedia('login', this.applyForm.value).subscribe(
        (response: any) => {
          this.Error = response.status.message;
          console.log(response.status.message);
          console.log(response.payload);
          
          console.log('Application submitted successfully:', response);
          if (response.status.message == 'Login successful.') {
            this.cookieService.set("user_details", JSON.stringify(response.payload));   
            
         
              this.userDetails = JSON.parse(this.cookieService.get('user_details'));
              this.username = this.userDetails.username;
              const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                }
              });
            
              this.route.navigateByUrl('/galleries');
            
            console.log(this.applyForm);
          }
         
        },
        (error) => {
          // Handle error response here if needed
          console.log(this.response.status.message);
          console.error('Error submitting application:', error);
        
        }
      );
    }
  }
