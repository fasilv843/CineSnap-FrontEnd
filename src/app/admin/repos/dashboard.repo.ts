/* eslint-disable @typescript-eslint/consistent-type-imports */
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { IRevenueData } from '../../core/models/chart.model'
import { IApiRes } from '../../core/models/api.model'

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardRepo {
  constructor (
    private readonly http: HttpClient
  ) { }

  getRevenueData (): Observable<IApiRes<IRevenueData | null>> {
    return this.http.get<IApiRes<IRevenueData | null>>('admin/dashboard/revenue')
  }
}
