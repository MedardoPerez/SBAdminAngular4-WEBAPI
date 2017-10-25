
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Observable } from 'rxjs/Observable';
import { Injectable, Inject, Optional, OpaqueToken } from '@angular/core';
import { Http, Headers, ResponseContentType, Response } from '@angular/http';

import * as moment from 'moment';

export const API_BASE_URL = new OpaqueToken('API_BASE_URL');

@Injectable()
export class LoginService {
    handleError: any;
    private http: Http;
    private baseUrl: string;
    private baseUrlLogin: string;
    protected jsonParseReviver: (key: string, value: any) => any = undefined;

    // tslint:disable-next-line:max-line-length
    constructor(@Inject(Http) http: Http, @Optional() @Inject(API_BASE_URL) baseUrl?: string, @Optional() @Inject(API_BASE_URL) _baseUrlLogin?: string) {
        this.http = http;
        this.baseUrl = baseUrl ? baseUrl : 'http://localhost:56115';
        this.baseUrlLogin = _baseUrlLogin;
        this.baseUrlLogin = this.baseUrl + '/token';
        // tslint:disable-next-line:prefer-const
        let prueba: string;
    }

login(userName, password) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Accept-Language', 'application/json');
        const body = 'UserName=' + userName + '&Password=' + password + '&grant_type=password';
        return this.http.post( this.baseUrlLogin, body, { headers }).map(res => res.json())
             .map(res => {

                sessionStorage.setItem('access_token', res.access_token);
                sessionStorage.setItem('bearer_token', res.bearer_token);
                sessionStorage.setItem('expires_in', res.expires_in.toString());
               localStorage.setItem('auth_token', res.auth_token);
             })
             .catch(this.handleError);
       }



  usuarios(): Observable<UserDTO[]> {
      let url = this.baseUrl + '/api/users/forall';
      url = url.replace(/[?&]$/, '');

      const options_ = {
        method: 'get',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
    };
    return this.http.request(url, options_).flatMap((response_) => {
        return this.processUsuario(response_);
    }).catch((response_: any) => {
        if (response_ instanceof Response) {
            try {
                return this.processUsuario(response_);
            } catch (e) {
                return <Observable<UserDTO[]>><any>Observable.throw(e);
            }
        // tslint:disable-next-line:curly
        } else
            return <Observable<UserDTO[]>><any>Observable.throw(response_);
    });
  }

  protected processUsuario(response: Response): Observable<UserDTO[]> {
    const status = response.status;

    const _headers: any = response.headers ? response.headers.toJSON() : {};
    if (status === 200) {
        const _responseText = response.text();
        let result200: any = null;
        const resultData200 = _responseText === '' ? null : JSON.parse(_responseText, this.jsonParseReviver);
        if (resultData200 && resultData200.constructor === Array) {
            result200 = [];
            // tslint:disable-next-line:curly
            for (const item of resultData200)
                result200.push(UserDTO.fromJS(item));
        }
        return Observable.of(result200);
    } else if (status !== 200 && status !== 204) {
        const _responseText = response.text();
        return throwException('An unexpected server error occurred.', status, _responseText, _headers);
    }
    return Observable.of<UserDTO[]>(<any>null);
}
}

export interface IAutenticacionUsuarioDTO {
    access_token: string;
    expires_in: number;
    token_type: string;
    tieneAcceso: boolean;
}

export class AutenticacionUsuarioDTO implements IAutenticacionUsuarioDTO {

    access_token: string;
    expires_in: number;
    token_type: string;
    tieneAcceso: boolean;

    constructor(data?: IAutenticacionUsuarioDTO) {
        if (data) {
            // tslint:disable-next-line:prefer-const
            for (let property in data) {
                // tslint:disable-next-line:curly
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }


        init(data ?: any) {
            if (data) {
                this.access_token = data['access_token'];
                this.expires_in = data['expires_in'];
                this.token_type = data['token_type'];
            }
        }

    // tslint:disable-next-line:member-ordering
    static fromJS(data: any): UserDTO {
        const result = new UserDTO();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data['access_token'] = this.access_token;
        data['expires_in'] = this.expires_in;
        data['token_type'] = this.token_type;
        return data; }
}


export interface IUserDTO {
    NumeroIdentidad: string;
    UsuarioId: string;
    Nombre: string;
    Apellido: string;
    Telefono: string;
    Correo: string;
    EstadoCivil: string;
    Contactos: string;
}

export class UserDTO implements IUserDTO {

    NumeroIdentidad: string;
    UsuarioId: string;
    Nombre: string;
    Apellido: string;
    Telefono: string;
    Correo: string;
    EstadoCivil: string;
    Contactos: string;
    constructor(data?: IUserDTO) {
        if (data) {
            // tslint:disable-next-line:prefer-const
            for (let property in data) {
                // tslint:disable-next-line:curly
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }


        init(data ?: any) {
            if (data) {
                this.NumeroIdentidad = data['NumeroIdentidad'];
                this.UsuarioId = data['UsuarioId'];
                this.Nombre = data['Nombre'];
                this.Apellido = data['Apellido'];
                this.Telefono = data['Telefono'];
                this.Correo = data['Correo'];
                this.EstadoCivil = data['EstadoCivil'];
                this.Contactos = data['Contactos'];
            }
        }

    // tslint:disable-next-line:member-ordering
    static fromJS(data: any): UserDTO {
        const result = new UserDTO();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data['NumeroIdentidad'] = this.NumeroIdentidad;
        data['UsuarioId'] = this.UsuarioId;
        data['Nombre'] = this.Nombre;
        data['Apellido'] = this.Apellido;
        data['Telefono'] = this.Telefono;
        data['Correo'] = this.Correo;
        data['EstadoCivil'] = this.EstadoCivil;
        data['Contactos'] = this.Contactos;
        return data; }
}

export class SwaggerException extends Error {
    message: string;
    status: number;
    response: string;
	// tslint:disable-next-line:indent
	headers: { [key: string]: any; };
    result: any;

    constructor(message: string, status: number, response: string, headers: { [key: string]: any; }, result: any) {
		// tslint:disable-next-line:indent
		super();

        this.message = message;
        this.status = status;
        this.response = response;
		// tslint:disable-next-line:indent
		this.headers = headers;
        this.result = result;
    }

    // tslint:disable-next-line:member-ordering
    protected isSwaggerException = true;

    // tslint:disable-next-line:member-ordering
    static isSwaggerException(obj: any): obj is SwaggerException {
        return obj.isSwaggerException === true;
    }
}

// tslint:disable-next-line:max-line-length
function throwException(message: string, status: number, response: string, headers: { [key: string]: any; }, result?: any): Observable<any> {
    // tslint:disable-next-line:curly
    if (result !== null && result !== undefined)
        return Observable.throw(result);
    // tslint:disable-next-line:curly
    else
        return Observable.throw(new SwaggerException(message, status, response, headers, null));
}

function blobToText(blob: any): Observable<string> {
    return new Observable<string>((observer: any) => {
        const reader = new FileReader();
        reader.onload = function() {
            observer.next(this.result);
            observer.complete();
        }
        reader.readAsText(blob);
    });
}
