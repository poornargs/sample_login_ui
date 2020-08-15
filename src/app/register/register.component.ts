import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import * as moment from 'moment';
import * as _ from 'underscore';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.styl']
})
export class RegisterComponent implements OnInit {

  registerData: any = {
    username: '',
    first_name: '',
    last_name: '',
    profile_pic: null,
    file_data: null,
    gender: 'Male',
    dob: null,
    email: '',
    mobile: '',
    address: '',
    password: '',
    status: 1
  };

  imageError: any = '';

  constructor(public _usersService: UsersService, public toastr: ToastrService, public router: Router) { }

  ngOnInit(): void {
  }

  fileChangeEvent(fileInput: any) {
    console.log(fileInput.target.files, 'files');

    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
      // Size Filter Bytes
      const max_size = 219889;
      const allowed_types = ['image/png', 'image/jpeg'];
      const max_height = 15200;
      const max_width = 25600;
      console.log(fileInput.target.files[0].size, max_size, 'size');


      if (fileInput.target.files[0].size > max_size) {
        this.imageError =
          'Maximum size allowed is ' + max_size / 1000 + 'Mb';

        return false;
      }

      if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
        this.imageError = 'Only Images are allowed ( JPG | PNG )';
        return false;
      }

      this.registerData.profile_pic = fileInput.target.files[0].name;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];

          console.log(img_height, img_width);


          if (img_height > max_height && img_width > max_width) {
            this.imageError =
              'Maximum dimentions allowed ' +
              max_height +
              '*' +
              max_width +
              'px';
            return false;
          } else {
            const imgBase64Path = e.target.result;
            this.registerData.file_data = imgBase64Path;
            console.log(imgBase64Path, 'imgBase64Path');

            // this.previewImagePath = imgBase64Path;
          }
        };
      };

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  onSubmit() {
    if (this.registerData.username == '' || this.registerData.first_name == '' || this.registerData.last_name == '' || this.registerData.dob == '' || this.registerData.dob == null || this.registerData.dob == undefined || this.registerData.email == '' || this.registerData.mobile == '' || this.registerData.address == '' || this.registerData.password == '') {
      this.toastr.error('Please fill all fields', '');
      return;
    }
    console.log(this.registerData, 'Register data');
    this.registerData.dob = moment(this.registerData.dob).format('YYYY-MM-DD');
    this._usersService.register(this.registerData).subscribe((response: any) => {
      console.log(response);
      if (response.success) {
        console.log(response.message);
        this.registerData = {
          username: '',
          first_name: '',
          last_name: '',
          profile_pic: null,
          file_data: null,
          gender: '',
          dob: null,
          email: '',
          mobile: '',
          address: '',
          password: '',
          status: 1
        };
        this.toastr.success(response.message, '');
        this.router.navigate(['/login']);
      } else {
        console.log(response.message);
        this.toastr.error(response.message, '');

      }
    })
  }

}
