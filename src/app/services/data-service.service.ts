import { Injectable } from '@angular/core'
import { type Observable, Subject } from 'rxjs'

@Injectable()
export class DataServiceService {
  private readonly dataSubject = new Subject<string>()

  emitData (data: string): void {
    this.dataSubject.next(data)
  }

  getCurrentData (): Observable<string> {
    return this.dataSubject.asObservable()
  }
}
