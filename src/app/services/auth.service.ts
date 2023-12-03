import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { type Observable } from 'rxjs'
import { environments } from 'src/environments/environment'
import { type IApiTokenRes } from '../models/users'
const { baseUrl } = environments

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor (
    @Inject(HttpClient) private readonly http: HttpClient
  ) { }

  // getAccessHeaders = new HttpHeaders({
  //   Authorization: `Bearer ${refreshToken}`,
  //   'Bypass-Interceptor': 'true'
  // })

  getAccessToken (refreshToken: string): Observable<IApiTokenRes> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${refreshToken}`,
        'Bypass-Interceptor': 'true'
      })
    }

    console.log(refreshToken, 'refresh token from get Access token service')
    // const headers = new HttpHeaders({
    //   Authorization: `Bearer ${refreshToken}`,
    //   'Bypass-Interceptor': 'true'
    // })
    return this.http.get<IApiTokenRes>(`${baseUrl}token`, httpOptions)
  }
}
