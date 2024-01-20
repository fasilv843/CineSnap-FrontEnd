import { Component, Inject, type OnDestroy, type OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Store, select } from '@ngrx/store'
import { type IChatReqs, type IChatMessage, type IApiChatRes } from 'src/app/models/chat'
import { type ITheaterRes } from 'src/app/models/theater'
import { TheaterService } from 'src/app/services/theater.service'
import { UserService } from 'src/app/services/user.service'
import { WebSocketService } from 'src/app/services/web-socket.service'
import { imagesFolderPath } from 'src/app/shared/constants'
import { selectUserDetails } from 'src/app/states/user/user.selector'
// import { NgxIntersectionObserverDirective } from 'ngx-intersection-observer'

@Component({
  selector: 'app-user-message',
  templateUrl: './user-message.component.html',
  styleUrls: ['./user-message.component.css']
})
export class UserMessageComponent implements OnInit, OnDestroy {
  // @ViewChild('messageContainer') messageContainer: ElementRef
  // @ViewChild(NgxIntersectionObserverDirective) observer: NgxIntersectionObserverDirective

  message: string = ''
  // feedback: string = ''
  chats: IChatMessage[] = []
  userDetails$ = this.store.pipe(select(selectUserDetails))
  theaterId: string = ''
  userId = ''
  userName = 'User'
  theaters: ITheaterRes[] = []
  currTheater!: ITheaterRes
  imageFolderPath = imagesFolderPath

  constructor (
    @Inject(WebSocketService) private readonly socketService: WebSocketService,
    @Inject(TheaterService) private readonly theaterService: TheaterService,
    @Inject(UserService) private readonly userService: UserService,
    @Inject(ActivatedRoute) private readonly route: ActivatedRoute,
    @Inject(Store) private readonly store: Store
  ) {
    this.userDetails$.subscribe((user) => {
      if (user !== null) {
        this.userId = user._id
        this.userName = user.name
      }
    })

    socketService.connectSocket(this.userId)
  }

  ngOnInit (): void {
    this.theaterService.getTheatersChattedWith(this.userId).subscribe({
      next: (res) => {
        this.theaters = res.data
        // this.currTheater = this.theaters[0]
      }
    })

    this.route.paramMap.subscribe(params => {
      const id = params.get('id')
      console.log(id, 'id from route snapshot')
      if (id !== null) {
        this.theaterService.getTheaterData(id).subscribe({
          next: (res) => {
            this.currTheater = res.data
          }
        })
      }
    })

    // this.socketService.listen('typing').subscribe((data) => { this.updateFeedback(data) })
    this.socketService.listen('recieve-message').subscribe((data) => { this.updateMessage(data) })
  }

  ngOnDestroy (): void {
    this.socketService.disconnectSocket()
  }

  onSelectTheater (theater: ITheaterRes): void {
    this.currTheater = theater
    this.userService.getChatHistory(theater._id, this.userId).subscribe({
      next: (res) => {
        if (res.data !== null) {
          this.chats = res.data.messages
        }
      }
    })
  }

  updateMessage (res: IApiChatRes): void {
    // this.feedback = ''
    if (res.data == null) return
    console.log(res.data.messages, 'data from update message')
    this.chats = res.data.messages
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
  //     name: this.userName,
  //     sender: this.userId,
  //     reciever: this.currTheater._id
  //   })
  // }

  sendMessage (): void {
    if (this.message !== '') {
      const msgData: IChatReqs = {
        userId: this.userId,
        theaterId: this.currTheater._id,
        sender: 'User',
        message: this.message
      }
      console.log('sending message', msgData)
      this.chats.push({
        sender: 'User',
        message: this.message,
        time: new Date(),
        isRead: false
      })
      this.socketService.emit('send-message', msgData)
      this.message = ''
    }
  }
}
