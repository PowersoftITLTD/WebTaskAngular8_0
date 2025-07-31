import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import _get from 'lodash/get';
import { Store } from '@ngrx/store';
import { loginSuccess } from '../../../store/auth/auth.actions';
import { MessageService } from 'primeng/api';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor(private store: Store) {}

  authService = inject(AuthService);
  fb = inject(FormBuilder);
  router = inject(Router);
  messageService = inject(MessageService);
  notificationService = inject(NotificationService);

  loginForm!: FormGroup;
  otpForm!: FormGroup;
  otpTemplate = signal(false);
  countdown = signal(94);
  private intervalId: any;
  isLoading: boolean = false;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      // email: ['', [Validators.required, Validators.email, this.customEmailValidator()]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
    });
  }
  getControl(controlName: string): FormControl {
    const control = this.loginForm.get(controlName) || this.otpForm.get(controlName);
    return control as FormControl;
  }
  setInitiatRoleId(access: any[]) {
    if (access && access.length) {
      return access[0]?.roleId;
    }
    return null;
  }
  onSubmit() {
    const payload = {
      Login_Name: this.getControl('username').value,
      Login_Password: this.getControl('password').value,
    };
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.login(payload).subscribe({
        next: (res) => {
          if (res[0]?.Status === 'Ok') {
            const jwtToken = res[0]?.Jwttoken;
            // localStorage.setItem('authToken', jwtToken);
            const userData = res[0]?.Data ? res[0].Data[0] : null;
            if (userData) {
              const loginData = {
                token: jwtToken,
                userId: userData.Mkey,
                userName: userData.Emp_Full_Name,
                ...userData
              };
              this.store.dispatch(loginSuccess({ authData: loginData }));
              this.router.navigate(['/']);
            }
          } else {
            this.notificationService.error(res[0]?.Message || 'Something went wrong');
          }

          this.isLoading = false;
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
    }
  }
  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
