import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Add this import
import { LoginModel } from '../../model/LoginModel';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SignupModel } from '../../model/SignupModel';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    CommonModule  // Add this import to the component
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true
})

export class LoginComponent implements OnInit {
  // Add this flag to track panel state
  isRightPanelActive = false;

  loginObj: LoginModel = {
    email: '',
    password: '',
  };

  signUpObj: SignupModel = {
    username: '',
    email: '',
    password: ''
  }

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    // We'll move the DOM manipulation to our toggle methods
  }

  // Add these methods to toggle panel state
  showSignUpPanel() {
    this.isRightPanelActive = true;
    console.log('Sign Up button clicked - adding class');
  }

  showSignInPanel() {
    this.isRightPanelActive = false;
    console.log('Sign In button clicked - removing class');
  }

  onLogin() {
    this.http
      .post('https://localhost:7137/api/Account/Login', this.loginObj)
      .subscribe({
        next: (res: any) => {
          localStorage.setItem('token', res.token);
          // Consider adding redirect here after successful login
          this.router.navigate(['/dashboard']); // Replace with appropriate route
        },
        error: (err) => {
          alert('Wrong Credentials');
        }
      });
  }

  onSignup(){
    this.http
      .post('https://localhost:7137/api/Account/SignUp', this.signUpObj)
      .subscribe({
        next: (res: any) => {
          localStorage.setItem('token', res.token);
          // Consider adding redirect here after successful login
          this.router.navigate(['/dashboard']); // Replace with appropriate route
        },
        error: (err) => {
          alert('Wrong Credentials');
        }
      });
  }
}