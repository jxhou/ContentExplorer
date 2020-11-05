import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '@app/core/services/users.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(private usersService: UsersService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    console.log(form);
    this.usersService.getUsers().subscribe((data) => {
      console.log(data);
      data.sort((a, b) => {
        return a.name.length - b.name.length;
      });
      console.log(data);
      form.reset();
      this.router.navigate(['']);

    }, (err) => {
      console.log(err);
    }, () => {
      console.log('complete!');
    });
  }

}
