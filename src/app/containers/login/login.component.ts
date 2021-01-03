import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private AuthService: AuthService) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

  onLogOut() {
    this.AuthService.logout();
  }

  isLoggedIn() {
    return this.AuthService.isLoggedIn();
  }

  login() {
    this.AuthService.login(this.loginForm.value.username, this.loginForm.value.password)
      .subscribe(() => {
        localStorage.setItem('username', this.loginForm.value.username);
        this.loginForm.reset();
        // this.router.navigate(['']);
        // or
        this.router.navigateByUrl('/dashboard');
      });

  }

}
