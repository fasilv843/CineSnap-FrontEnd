import { ChangeDetectionStrategy, Component, DestroyRef, type ElementRef, computed, effect, inject, linkedSignal, signal, viewChild } from '@angular/core'
import { rxResource, takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop'
import { DatePipe } from '@angular/common'
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router'
import { Store } from '@ngrx/store'
import { forkJoin, map } from 'rxjs'
import { type IApiChatRes, type IChatMessage, type IChatReqs } from 'src/app/models/chat'
import { type ITheaterRes } from 'src/app/models/theater'
import { TheaterService } from 'src/app/services/theater.service'
import { UserService } from 'src/app/services/user.service'
import { WebSocketService } from 'src/app/services/web-socket.service'
import { imagesFolderPath } from 'src/app/shared/constants'
import { AvatarComponent } from 'src/app/shared/ui/avatar.component'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { selectUserDetails } from 'src/app/states/user/user.selector'
import { UserNavComponent } from '../user-nav/user-nav.component'

interface Contact { id: string, name: string, image: string | null }
interface DayGroup { day: Date, messages: IChatMessage[] }

function toContact (theater: ITheaterRes): Contact {
  return {
    id: theater._id,
    name: theater.name,
    image: theater.profilePic !== undefined && theater.profilePic !== '' ? imagesFolderPath + theater.profilePic : null
  }
}

function startOfDay (date: Date | string): Date {
  const day = new Date(date)
  day.setHours(0, 0, 0, 0)
  return day
}

@Component({
  selector: 'app-user-message',
  templateUrl: './user-message.component.html',
  styleUrl: './user-message.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UserNavComponent, RouterLink, RouterLinkActive, ButtonDirective, AvatarComponent, DatePipe]
})
export class UserMessageComponent {
  private readonly socket = inject(WebSocketService)
  private readonly theaterService = inject(TheaterService)
  private readonly userService = inject(UserService)
  private readonly route = inject(ActivatedRoute)
  private readonly store = inject(Store)

  private readonly userId = this.store.selectSignal(selectUserDetails)()?._id ?? ''

  // Conversation list ------------------------------------------------------

  protected readonly contacts = rxResource({
    stream: () => this.theaterService.getTheatersChattedWith(this.userId).pipe(map(res => res.data.map(toContact)))
  })

  // Open conversation: /user/messages/:id ------------------------------------

  protected readonly theaterId = toSignal(this.route.paramMap.pipe(map(params => params.get('id'))), { requireSync: true })

  private readonly conversation = rxResource({
    params: () => this.theaterId() ?? undefined,
    stream: ({ params: theaterId }) => forkJoin({
      theater: this.theaterService.getTheaterData(theaterId).pipe(map(res => toContact(res.data))),
      messages: this.userService.getChatHistory(theaterId, this.userId).pipe(map(res => res.data?.messages ?? []))
    })
  })

  protected readonly partner = computed(() => this.conversation.value()?.theater ?? null)
  protected readonly isLoadingChat = this.conversation.isLoading

  // Starts from the loaded history; sent and received messages are added locally
  protected readonly messages = linkedSignal<IChatMessage[]>(() => this.conversation.value()?.messages ?? [])

  protected readonly days = computed<DayGroup[]>(() => {
    const groups: DayGroup[] = []
    for (const message of this.messages()) {
      const day = startOfDay(message.time)
      const last = groups.at(-1)
      if (last !== undefined && last.day.getTime() === day.getTime()) last.messages.push(message)
      else groups.push({ day, messages: [message] })
    }
    return groups
  })

  protected readonly today = startOfDay(new Date())
  protected readonly draft = signal('')

  private readonly scroller = viewChild<ElementRef<HTMLElement>>('scroller')

  constructor () {
    this.socket.connectSocket(this.userId)
    inject(DestroyRef).onDestroy(() => { this.socket.disconnectSocket() })

    this.socket.listen('recieve-message').pipe(takeUntilDestroyed()).subscribe((res: IApiChatRes) => {
      if (res.data !== null && res.data.theaterId === this.theaterId()) this.messages.set(res.data.messages)
    })

    // Keep the newest message in view
    effect(() => {
      const count = this.messages().length
      const element = this.scroller()?.nativeElement
      if (element !== undefined && count >= 0) element.scrollTop = element.scrollHeight
    })
  }

  protected send (): void {
    const text = this.draft().trim()
    const theaterId = this.theaterId()
    if (text === '' || theaterId === null) return
    const request: IChatReqs = { userId: this.userId, theaterId, sender: 'User', message: text }
    this.socket.emit('send-message', request)
    this.messages.update(list => [...list, { sender: 'User', message: text, time: new Date(), isRead: false }])
    this.draft.set('')
  }
}
