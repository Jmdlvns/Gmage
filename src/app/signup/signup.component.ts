import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DataService } from '../data.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  constructor(private ds: DataService, private route: Router) {}

  applyForm = new FormGroup({
    username: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
  });


  Signup() {
    this.ds.sendRequest('add-user', this.applyForm.value).subscribe(
      (response) => {
        console.log('Application submitted successfully:', response);
        console.log(this.applyForm);
        this.route.navigateByUrl('login');
      },
      (error) => {
        console.error('Error submitting application:', error);
      }
    );
  }
}
