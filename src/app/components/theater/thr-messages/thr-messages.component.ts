/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, Inject, type OnInit, type OnDestroy } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { type IApiChatRes, type IChatReqs, type IChatRes, type IUsersListForChats, IChatMessageRes } from 'src/app/models/chat'
import { TheaterService } from 'src/app/services/theater.service'
import { UserService } from 'src/app/services/user.service'
import { WebSocketService } from 'src/app/services/web-socket.service'
import { imagesFolderPath } from 'src/app/shared/constants'
import { selectTheaterDetails } from 'src/app/states/theater/theater.selector'

@Component({
  selector: 'app-thr-messages',
  templateUrl: './thr-messages.component.html',
  styleUrls: ['./thr-messages.component.css']
})
export class ThrMessagesComponent implements OnInit, OnDestroy {
  message: string = ''
  chats: IChatMessageRes[] = []
  theaterDetails$ = this.store.pipe(select(selectTheaterDetails))
  theaterId: string = ''
  userId = ''
  theaterName = ''
  users: IUsersListForChats[] = []
  currUser?: IUsersListForChats
  imageFolderPath = imagesFolderPath

  constructor (
    @Inject(WebSocketService) private readonly socketService: WebSocketService,
    @Inject(TheaterService) private readonly theaterService: TheaterService,
    @Inject(UserService) private readonly userService: UserService,
    @Inject(Store) private readonly store: Store
  ) {
    this.theaterDetails$.subscribe((theater) => {
      if (theater !== null) {
        this.theaterId = theater._id
        this.theaterName = theater.name
      }
    })

    socketService.connectSocket(this.theaterId)
  }

  ngOnInit (): void {
    this.userService.getUsersChattedWith(this.theaterId).subscribe({
      next: (res) => {
        if (res.data !== null) {
          this.users = res.data
        }
      }
    })

    this.socketService.listen('recieve-message').subscribe((res: IApiChatRes) => {
      if (res.data !== null) {
        this.updateMessage(res.data)
      }
    })
  }

  ngOnDestroy (): void {
    this.socketService.disconnectSocket()
  }

  onSelectUser (user: IUsersListForChats, index: number): void {
    this.currUser = user
    this.theaterService.getChatHistory(this.theaterId, user._id).subscribe({
      next: (res) => {
        if (res.data !== null) {
          this.chats = res.data.messages
          this.users = [
            ...this.users.slice(0, index),
            { ...this.users[index], unreadCount: 0 },
            ...this.users.slice(index + 1)
          ]
        }
      }
    })
  }

  updateMessage (chatRes: IChatRes): void {
    console.log(chatRes.messages, 'data from update message')
    // eslint-disable-next-line eqeqeq
    if (this.currUser !== undefined && this.currUser._id == chatRes.userId) {
      this.chats = chatRes.messages
      const lastMsg = chatRes.messages[chatRes.messages.length - 1]
      if (lastMsg !== undefined) {
        this.theaterService.markLastMessageAsRead(chatRes.userId, chatRes.theaterId, chatRes.adminId, lastMsg._id).subscribe({
          next: () => {
            console.log('message marked as read successfully')
          }
        })
      }
    } else {
      const userIdx = this.users.findIndex(user => user._id === chatRes.userId)
      this.users = [
        ...this.users.slice(0, userIdx),
        { ...this.users[userIdx], unreadCount: this.users[userIdx].unreadCount + 1 },
        ...this.users.slice(userIdx + 1)
      ]
    }
  }

  sendMessage (): void {
    if (this.currUser === undefined) return
    if (this.message !== '') {
      const msgData: IChatReqs = {
        userId: this.currUser._id,
        theaterId: this.theaterId,
        sender: 'Theater',
        message: this.message
      }
      console.log('sending message', msgData)
      this.chats.push({
        _id: '',
        sender: 'Theater',
        message: this.message,
        time: new Date(),
        isRead: false
      })
      this.socketService.emit('send-message', msgData)
      this.message = ''
    }
  }
}
