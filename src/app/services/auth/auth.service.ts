import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
// import { logout } from '@store/auth/auth.actions';

// Store
import { Store } from '@ngrx/store';
import { environment } from '../../../environments/environments.prod';
import { logout } from '../../store/auth/auth.actions';
interface Credential {
  Login_Name: string;
  Login_Password: string;
}

const endpointPaths = {
  login: '/Authentication/Login_NT',
  commonApi: '/CommonApi',
  viewClassification: '/ViewClassification',
  ApprovalTemplate:'/ApprovalTemplate'
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  store = inject(Store);

  login(credential: Credential): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}${endpointPaths.login}`, credential);
  }

  postDetails(url: string, body: Object, isCommonApi?: boolean, viewClassification?: boolean, ApprovalTemplate?:boolean): Observable<any> {
    if (isCommonApi) {
      url = endpointPaths.commonApi + '/' + url;
    }
    if (viewClassification) {
      url = endpointPaths.viewClassification + '/' + url;
    }    

    if (ApprovalTemplate){
       url = endpointPaths.ApprovalTemplate + '/' + url
    }

    // console.log('`${environment.apiBaseUrl}${url}`',`${environment.apiBaseUrl}${url}`);
    // console.log('body: ', body)

    // console.log('check url: ', `${environment.apiBaseUrl}${url}`)
    return this.http.post(`${environment.apiBaseUrl}${url}`, body);
  }


  getDetails( body:Object|any): Observable<any>{
    console.log('body getDetails: ', body)
    let url = `${endpointPaths.ApprovalTemplate}?Building=${body?.buildingType}&Standard=${body?.buildingStandard}&Authority=${body?.statutoryAuthority}`
    console.log(`url: ${environment.apiBaseUrl}${url}`)
    return this.http.get(`${environment.apiBaseUrl}${url}`)
  }



  logout() {
    localStorage.clear();
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }
}
