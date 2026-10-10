import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AdminNavComponent } from '../admin-nav/admin-nav.component';

@Component({
    selector: 'app-admin-messages',
    templateUrl: './admin-messages.component.html',
    styleUrls: ['./admin-messages.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [AdminNavComponent]
})
export class AdminMessagesComponent {

}
