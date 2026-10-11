import { ChangeDetectionStrategy, Component, DestroyRef, type ElementRef, computed, effect, inject, linkedSignal, signal, viewChild } from '@angular/core'
import { rxResource, takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop'
import { DatePipe } from '@angular/common'
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router'
import { Store } from '@ngrx/store'
import { map } from 'rxjs'
import { type IApiChatRes, type IChatMessage, type IChatReqs, type IUsersListForChats } from 'src/app/models/chat'
import { TheaterService } from 'src/app/services/theater.service'
import { UserService } from 'src/app/services/user.service'
import { WebSocketService } from 'src/app/services/web-socket.service'
import { imagesFolderPath } from 'src/app/shared/constants'
import { AvatarComponent } from 'src/app/shared/ui/avatar.component'
import { ButtonDirective } from 'src/app/shared/ui/button.directive'
import { IconComponent } from 'src/app/shared/ui/icon.component'
import { StatePanelComponent } from 'src/app/shared/ui/state-panel.component'
import { selectTheaterDetails } from 'src/app/states/theater/theater.selector'
import { valueOf } from 'src/app/helpers/resource'

interface Contact { id: string, name: string, image: string | null, unread: number }
interface DayGroup { day: Date, messages: IChatMessage[] }

function toContact (user: IUsersListForChats): Contact {
  return {
    id: user._id,
    name: user.name,
    image: user.profilePic !== undefined && user.profilePic !== '' ? imagesFolderPath + user.profilePic : null,
    unread: user.unreadCount
  }
}

function startOfDay (date: Date | string): Date {
  const day = new Date(date)
  day.setHours(0, 0, 0, 0)
  return day
}

@Component({
  selector: 'app-thr-messages',
  templateUrl: './thr-messages.component.html',
  styleUrl: './thr-messages.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, DatePipe, AvatarComponent, ButtonDirective, IconComponent, StatePanelComponent]
})
export class ThrMessagesComponent {
  private readonly socket = inject(WebSocketService)
  private readonly theaterService = inject(TheaterService)
  private readonly userService = inject(UserService)

  private readonly theaterId = inject(Store).selectSignal(selectTheaterDetails)()?._id ?? ''

  // Conversation list --------------------------------------------------------

  protected readonly loadedContacts = rxResource({
    stream: () => this.userService.getUsersChattedWith(this.theaterId).pipe(map(res => (res.data ?? []).map(toContact)))
  })

  /** Local copy so unread counts change without refetching */
  protected readonly contacts = linkedSignal(() => valueOf(this.loadedContacts) ?? [])

  // Open conversation: /theater/messages/:id ----------------------------------

  protected readonly userId = toSignal(inject(ActivatedRoute).paramMap.pipe(map(params => params.get('id'))), { requireSync: true })

  protected readonly conversation = rxResource({
    params: () => this.userId() ?? undefined,
    stream: ({ params: userId }) => this.theaterService.getChatHistory(this.theaterId, userId).pipe(map(res => res.data?.messages ?? []))
  })

  protected readonly partner = computed(() => this.contacts().find(contact => contact.id === this.userId()) ?? null)
  protected readonly messages = linkedSignal<IChatMessage[]>(() => valueOf(this.conversation) ?? [])

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
    this.socket.connectSocket(this.theaterId)
    inject(DestroyRef).onDestroy(() => { this.socket.disconnectSocket() })

    this.socket.listen('recieve-message').pipe(takeUntilDestroyed()).subscribe((res: IApiChatRes) => {
      const chat = res.data
      if (chat === null || chat.userId === undefined) return
      if (chat.userId === this.userId()) {
        this.messages.set(chat.messages)
        const last = chat.messages.at(-1)
        if (last !== undefined) this.theaterService.markLastMessageAsRead(chat.userId, chat.theaterId, chat.adminId, last._id).subscribe()
      } else if (this.contacts().some(contact => contact.id === chat.userId)) {
        this.contacts.update(list => list.map(c => c.id === chat.userId ? { ...c, unread: c.unread + 1 } : c))
      } else {
        this.loadedContacts.reload() // a new person started a conversation
      }
    })

    // Opening a conversation reads it
    effect(() => {
      const id = this.userId()
      if (id !== null && this.conversation.hasValue()) {
        this.contacts.update(list => list.map(c => c.id === id && c.unread > 0 ? { ...c, unread: 0 } : c))
      }
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
    const userId = this.userId()
    if (text === '' || userId === null) return
    const request: IChatReqs = { userId, theaterId: this.theaterId, sender: 'Theater', message: text }
    this.socket.emit('send-message', request)
    this.messages.update(list => [...list, { sender: 'Theater', message: text, time: new Date(), isRead: false }])
    this.draft.set('')
  }
}
