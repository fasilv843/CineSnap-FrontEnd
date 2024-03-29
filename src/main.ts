// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'

import { AppModule } from './app/app.module'

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => { console.error(err) })
