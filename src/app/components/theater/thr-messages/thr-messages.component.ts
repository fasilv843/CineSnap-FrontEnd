import { Component, Inject, type OnInit, type OnDestroy } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { select, Store } from '@ngrx/store'
import { type IChatMessage, type IApiChatRes, type IChatReqs } from 'src/app/models/chat'
import { type IUserRes } from 'src/app/models/users'
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
  // feedback: string = ''
  chats: IChatMessage[] = []
  theaterDetails$ = this.store.pipe(select(selectTheaterDetails))
  theaterId: string = ''
  userId = ''
  theaterName = ''
  users: IUserRes[] = []
  currUser?: IUserRes
  unreadMessages: Record<string, number> = {}
  imageFolderPath = imagesFolderPath

  constructor (
    @Inject(WebSocketService) private readonly socketService: WebSocketService,
    @Inject(TheaterService) private readonly theaterService: TheaterService,
    @Inject(UserService) private readonly userService: UserService,
    @Inject(ActivatedRoute) private readonly route: ActivatedRoute,
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
        this.users = res.data
      }
    })

    this.route.paramMap.subscribe(params => {
      const id = params.get('id')
      console.log(id, 'id from route snapshot')
      if (id !== null) {
        this.userService.getUserDetails(id).subscribe({
          next: (res) => {
            if (res.data !== null) this.currUser = res.data
          }
        })
      }
    })

    this.socketService.listen('recieve-message').subscribe((data) => { this.updateMessage(data) })
  }

  ngOnDestroy (): void {
    this.socketService.disconnectSocket()
  }

  onSelectUser (user: IUserRes): void {
    this.currUser = user
    this.theaterService.getChatHistory(this.theaterId, user._id).subscribe({
      next: (res) => {
        if (res.data !== null) {
          this.chats = res.data.messages
          this.unreadMessages[user._id] = 0
        }
      }
    })
  }

  updateMessage (res: IApiChatRes): void {
    if (res.data == null) return
    console.log(res.data.messages, 'data from update message')
    // eslint-disable-next-line eqeqeq
    if (this.currUser !== undefined && this.currUser._id == res.data.userId) {
      this.chats = res.data.messages
    } else {
      const unreadCount = this.unreadMessages[res.data.userId as string]
      this.unreadMessages[res.data.userId as string] = (unreadCount === undefined) ? 1 : unreadCount + 1
    }
  }

  getUnreadCount (userId: string): number {
    console.log(this.unreadMessages, 'unreadMessages object')
    return this.unreadMessages[userId] ?? 0
  }

  // updateFeedback (data: { name: string, sender: string, reciever: string }): void {
  //   console.log(data, 'data from updateFeedback, typing message')
  //   this.feedback = `${data.name} is typing a message`
  //   // eslint-disable-next-line no-return-assign
  //   debounce(() => this.feedback = '')
  // }

  // messageTyping (): void {
  //   console.log('user is typing')
  //   this.socketService.emit('typing', {
  //     name: this.theaterName,
  //     sender: this.theaterId,
  //     reciever: this.currUser._id
  //   })
  // }

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
        sender: 'Theater',
        message: this.message,
        time: new Date()
      })
      this.socketService.emit('send-message', msgData)
      this.message = ''
    }
  }
}
