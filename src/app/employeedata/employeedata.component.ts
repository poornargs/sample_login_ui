import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { UsersService } from '../users.service';
import { ToastrService } from 'ngx-toastr';

import * as moment from 'moment';
import * as _ from 'underscore';

@Component({
  selector: 'app-employeedata',
  templateUrl: './employeedata.component.html',
  styleUrls: ['./employeedata.component.styl']
})
export class EmployeedataComponent implements OnInit {
  Data: any = [];
  formData: any = {
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
    status: 1
  };
  formType: any = 'add';
  deleteUserName: any = null;
  imageError: any = '';

  constructor(public _usersService: UsersService, public toastr: ToastrService) { }

  ngOnInit(): void {
    this.getEmployeeData();
  }

  getEmployeeData() {
    this._usersService.getEmployees().subscribe((response: any) => {
      console.log(response, 'employees');
      if (response.success) {
        console.log('employees list');
        this.Data = response.data;
      } else {
        console.log(response.message);
        this.Data = [];
      }
    })
  }

  openForm(type: any, body: any) {
    this.formType = type;
    if (type == 'add') {
      this.formData = {
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
    } else {
      this.formData = {
        username: body.username,
        first_name: body.first_name,
        last_name: body.last_name,
        profile_pic: null,
        file_data: null,
        gender: body.gender,
        dob: moment(body.dob).format('YYYY-MM-DD'),
        email: body.email,
        mobile: body.mobile,
        address: body.address,
        status: +body.status,
      };
    }
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

      this.formData.profile_pic = fileInput.target.files[0].name;
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
            this.formData.file_data = imgBase64Path;
            console.log(imgBase64Path, 'imgBase64Path');

            // this.previewImagePath = imgBase64Path;
          }
        };
      };

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  onSubmit() {

    console.log(this.formData, 'Employee data');
    if (this.formData.username == '' || this.formData.first_name == '' || this.formData.last_name == '' || this.formData.dob == '' || this.formData.dob == null || this.formData.dob == undefined || this.formData.email == '' || this.formData.mobile == '' || this.formData.address == '' || (this.formData == 'add' && this.formData.password == '')) {
      this.toastr.error('Please fill all fields', '');
      return;
    }
    this.formData.dob = moment(this.formData.dob).format('YYYY-MM-DD');
    if (!this.formData.profile_pic) {
      delete this.formData.profile_pic;
      delete this.formData.file_data;
    }
    this._usersService.SaveEmployees(this.formData).subscribe((response: any) => {
      console.log(response);
      if (response.success) {
        console.log(response.message);
        this.formData = {
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
          status: 1
        };

        this.getEmployeeData();

        this.toastr.success(response.message, '');
      } else {
        console.log(response.message);

        this.toastr.error(response.message, '');

      }
    })
  }

  deleteUser() {
    this._usersService.deleteUser({ username: this.deleteUserName }).subscribe((response: any) => {
      console.log(response, 'response');
      if (response.success) {
        console.log(response.message);

        this.getEmployeeData();
        this.toastr.success(response.message, '');
      } else {
        console.log(response.message);

        this.toastr.error(response.message, '');

      }
    })
  }

}
