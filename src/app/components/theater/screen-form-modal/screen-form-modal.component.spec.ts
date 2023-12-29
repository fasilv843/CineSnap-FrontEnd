import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenFormModalComponent } from './screen-form-modal.component';

describe('ScreenFormModalComponent', () => {
  let component: ScreenFormModalComponent;
  let fixture: ComponentFixture<ScreenFormModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ScreenFormModalComponent]
    });
    fixture = TestBed.createComponent(ScreenFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
