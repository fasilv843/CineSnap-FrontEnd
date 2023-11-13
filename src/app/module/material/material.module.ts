/* eslint-disable @typescript-eslint/semi */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
// import { }

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule
  ]
})
export class MaterialModule {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports, @typescript-eslint/ban-types
  static forRoot (): any[] | import('@angular/core').Type<any> | import('@angular/core').ModuleWithProviders<{}> {
    throw new Error('Method not implemented.');
  }
}
