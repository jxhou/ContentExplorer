import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { subscribeOn } from 'rxjs/operators';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.minLength(6), Validators.required]]
  });

  errorMessage: string = '';

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.errorMessage = '';
  }

  onSubmit() {
    this.errorMessage = '';
    const value = this.signUpForm.value;
    this.authService.signUp(value.firstName, value.lastName, value.email, value.password)
      .subscribe(
        (data) => {
          console.log(data);
          this.router.navigate(['/login']);
        },
        (err) => {
          console.log(err);
          this.errorMessage = err.error;

        },
        () => {
          console.log('Complete');
        });
  }

}
