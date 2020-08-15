import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.styl']
})
export class LoginComponent implements OnInit {
  ShowType : any = 'login';
  form: any = {
    username: '',
    password: ''
  }

  constructor(public _usersService: UsersService, public _router: Router, public toastr: ToastrService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.form.username == '' || this.form.password == '') {
      this.toastr.error('Please fill all fields', '');
      return;
    }
    console.log('On submit', this.form);
    this._usersService.login(this.form).subscribe((response: any) => {
      console.log(response, 'response');
      if (response['success']) {
        console.log('login success');
        this.toastr.success('Login success!', '');
        this._router.navigate(['/employee-data'])
      } else {

        this.toastr.error(response.message, '');
        console.log('login failed');

      }

    })

  }

  goToRegister(value:any){
    this.ShowType = value;
  }

}
