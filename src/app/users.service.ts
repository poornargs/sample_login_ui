
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root',
})
export class UsersService {

    appSettings = {
        LOGIN: 'http://127.0.0.1:4545/login',
        REGISTER: 'http://127.0.0.1:4545/register',
        EMPLOYEES: 'http://127.0.0.1:4545/employees',
        DELETE_USER: 'http://127.0.0.1:4545/delete/user'
    };


    constructor(
        public _apiService: ApiService
    ) {
        console.log('AppSettings.LOGIN',
            //  this._app.LOGIN,
            this.appSettings.LOGIN);

    }

    login(body: any) {
        return this._apiService.callApi({url: this.appSettings.LOGIN, method: 'POST', body});
    }

    register(body: any) {
        return this._apiService.callApi({url: this.appSettings.REGISTER, method: 'POST', body});
    }
    
    deleteUser(body: any) {
        return this._apiService.callApi({url: this.appSettings.DELETE_USER, method: 'POST', body});
    }

    getEmployees() {
        return this._apiService.callApi({url: this.appSettings.EMPLOYEES, method: 'GET'});
    }

    SaveEmployees(body: any) {
        return this._apiService.callApi({url: this.appSettings.EMPLOYEES, method: 'POST', body});
    }

}
