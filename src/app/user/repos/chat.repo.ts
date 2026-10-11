import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { type Observable } from 'rxjs'
import { type IApiChatRes } from 'src/app/core/models/chat.model'
import { type IApiTheatersRes } from 'src/app/core/models/theater.model'

@Injectable({ providedIn: 'root' })
export class UserChatRepo {
  private readonly http = inject(HttpClient)

  getTheatersChattedWith (userId: string): Observable<IApiTheatersRes> {
    return this.http.get<IApiTheatersRes>(`user/chat/theaters/${userId}`)
  }

  getChatHistory (theaterId: string, userId: string): Observable<IApiChatRes> {
    return this.http.get<IApiChatRes>(`user/chat/history?theaterId=${theaterId}&userId=${userId}`)
  }
}
