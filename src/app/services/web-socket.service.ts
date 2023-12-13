import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
// import * as io from 'socket.io-client'
import { type Socket, io } from 'socket.io-client'
import { environments } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  socket!: Socket

  // constructor (id: string) {
  //   this.socket = io(environments.backendUrl, { query: { id } })
  // }

  connectSocket (id: string): void {
    this.socket = io(environments.backendUrl, { query: { id } })
  }

  listen (eventName: string): Observable<any> {
    return new Observable((subscribe) => {
      this.socket.on(eventName, (data) => {
        subscribe.next(data)
      })
    })
  }

  emit (eventName: string, data: any): void {
    this.socket.emit(eventName, data)
  }

  disconnectSocket (): void {
    this.socket.disconnect()
  }
}
