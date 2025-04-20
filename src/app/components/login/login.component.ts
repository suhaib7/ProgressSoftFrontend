import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Add this import
import { LoginModel } from '../../model/LoginModel';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SignupModel } from '../../model/SignupModel';
import { AlertService } from '../../services/AlertService';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true
})

export class LoginComponent implements OnInit {
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

  constructor(private router: Router, private http: HttpClient, private alert: AlertService) {}

  ngOnInit(): void {
  }

  showSignUpPanel() {
    this.isRightPanelActive = true;
  }

  showSignInPanel() {
    this.isRightPanelActive = false;
  }

  onLogin() {
    this.http
      .post('https://localhost:7137/api/Account/Login', this.loginObj)
      .subscribe({
        next: (res: any) => {
          localStorage.setItem('token', res.token);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.alert.openAlertDialogAsync('Wrong Credentials');
        }
      });
  }  

  onSignup(){
    this.http
      .post('https://localhost:7137/api/Account/SignUp', this.signUpObj)
      .subscribe({
        next: (res: any) => {
          localStorage.setItem('token', res.token);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.alert.openAlertDialogAsync('Email already exists!');
        }
      });
  }
}