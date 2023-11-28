import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { map, type Observable } from 'rxjs'
import { environments } from 'src/environments/environment'
import { type IUserAddress } from '../models/common'

@Injectable({
  providedIn: 'root'
})
export class GeoLocationService {
  constructor (
    @Inject(HttpClient) private readonly http: HttpClient
  ) { }

  getAddress (lat: number, lon: number): Observable<IUserAddress> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Bypass-Interceptor': 'true' })
    }

    const { geoapifyApi, geoapifyKey } = environments

    return this.http.get<any>(`${geoapifyApi}?lat=${lat}&lon=${lon}&apiKey=${geoapifyKey}`, httpOptions).pipe(
      map(res => ({
        city: res.features[0].properties.city,
        district: res.features[0].properties.state_district,
        state: res.features[0].properties.state,
        country: res.features[0].properties.country,
        zip: res.features[0].properties.postcode
      }))
    )
  }
}
