import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { map, type Observable } from 'rxjs'
import { environments } from 'src/environments/environment'
import { type ICoords, type IUserAddress } from '../models/common'

const { geoapifyApi, geoapifyKey } = environments

@Injectable({
  providedIn: 'root'
})
export class GeoLocationService {
  constructor (
    @Inject(HttpClient) private readonly http: HttpClient
  ) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Bypass-Interceptor': 'true' })
  }

  getAddress (lat: number, lon: number): Observable<IUserAddress> {
    return this.http.get<any>(`${geoapifyApi}/reverse?lat=${lat}&lon=${lon}&apiKey=${geoapifyKey}`, this.httpOptions).pipe(
      map(res => ({
        city: res.features[0].properties.city,
        district: res.features[0].properties.state_district,
        state: res.features[0].properties.state,
        country: res.features[0].properties.country,
        zip: res.features[0].properties.postcode
      }))
    )
  }

  getCoords (city: string, country: string, zip: number): Observable<ICoords> {
    return this.http.get<any>(`${geoapifyApi}/search?postcode=${zip}&city=${city}&country=${country}&apiKey=${geoapifyKey}`, this.httpOptions).pipe(
      map(res => ({
        type: res.features[0].geometry.type,
        coordinates: res.features[0].geometry.coordinates
      }))
    )
  }
}
