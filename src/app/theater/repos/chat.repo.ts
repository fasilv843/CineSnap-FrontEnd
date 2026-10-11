import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { type Observable } from 'rxjs'
import { type IApiRes } from 'src/app/core/models/api.model'
import { type IApiChatRes, type IUsersListForChats } from 'src/app/core/models/chat.model'

@Injectable({ providedIn: 'root' })
export class TheaterChatRepo {
  private readonly http = inject(HttpClient)

  getUsersChattedWith (theaterId: string): Observable<IApiRes<IUsersListForChats[] | null>> {
    return this.http.get<IApiRes<IUsersListForChats[] | null>>(`theater/chat/users/${theaterId}`)
  }

  getChatHistory (theaterId: string, userId: string): Observable<IApiChatRes> {
    return this.http.get<IApiChatRes>(`theater/chat/history?theaterId=${theaterId}&userId=${userId}`)
  }

  markLastMessageAsRead (userId: string | undefined, theaterId: string | undefined, adminId: string | undefined, msgId: string): Observable<IApiRes<null>> {
    return this.http.patch<IApiRes<null>>(`theater/chat/mark/read?userId=${userId ?? ''}&theaterId=${theaterId ?? ''}&adminId=${adminId ?? ''}&msgId=${msgId}`, {})
  }
}
