import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  isLogin = true;
  showPassword = false;
  loginForm!: FormGroup;
  signupForm!: FormGroup;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });

    this.signupForm = new FormGroup({
      fullName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]{10}$'),
      ]),
    });
  }

  showLogin() {
    this.isLogin = true;
  }

  showSignup() {
    this.isLogin = false;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.userService.login(this.loginForm.value).subscribe({
        next: (res) => {
          console.log(res);
          const token = (res as any).result.accessToken;

          localStorage.setItem('token', token);

          let users = JSON.parse(localStorage.getItem('users') || '[]');

          let loggedInUser = users.find(
            (user: any) => user.email === this.loginForm.value.email
          );

          if (loggedInUser) {
            localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
          }

          this.router.navigate(['/home']);
        },
        error: (err) => console.error('Login failed:', err),
      });
    }
  }

  onSignup(): void {
    if (this.signupForm.valid) {
      this.userService.register(this.signupForm.value).subscribe({
        next: (res) => {
          console.log('Signup success:', res);
          const user = (res as any).result;

          let users = JSON.parse(localStorage.getItem('users') || '[]');

          users.push({
            fullName: user.fullName,
            email: user.email,
            _id: user._id,
            phone: user.phone,
            password: user.password,
            address: user.address || [],
          });

          localStorage.setItem('users', JSON.stringify(users));

          this.signupForm.reset();
          this.isLogin = true;
        },
        error: (err) => console.error('Signup failed:', err),
      });
    }
  }
}
