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
    return new Observable((subscriber) => {
      const handler = (data: unknown): void => { subscriber.next(data) }
      this.socket.on(eventName, handler)
      // Remove the handler on unsubscribe so revisiting a page doesn't stack listeners
      return () => { this.socket.off(eventName, handler) }
    })
  }

  emit (eventName: string, data: any): void {
    this.socket.emit(eventName, data)
  }

  disconnectSocket (): void {
    this.socket.disconnect()
  }
}
