import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { FormsModule } from '@angular/forms';
import {Http} from '@angular/http';
import { UserDTO, LoginService } from 'app/shared/services/LoginService';

// import { LoginService } from '../shared/services/LoginService'
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
   ListaUsuarios: UserDTO[];
    @Input() name: string;
    @Input() pass: string;
    MensajeError: string;
    Islogged: any;
    returnUrl: string;
    loading = false;

    constructor(private _loginService: LoginService, public router: Router) {
    }

    ngOnInit() {
        this.cargarDatos();
    }
    onLoggedin() {
        // console.log(this.name);
        // console.log(this.pass);
        // const valido = this._loginService.login(this.name, this.pass);
       this._loginService.login(this.name, this.pass).subscribe((result) => {

        this.router.navigate(['/dashboard']);
        localStorage.setItem('isLoggedin', 'true');
        this.MensajeError = '';
        }, error => {
            this.MensajeError = 'Usuario o Password incorrecto';
            this.loading = false;
        });
    }

    // tslint:disable-next-line:one-line
    cargarDatos(){
        this._loginService.usuarios()
         .subscribe((result) => {
             this.ListaUsuarios = result;
             console.log(result);

         })
     }
}
