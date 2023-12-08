import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowFormModalComponent } from './show-form-modal.component';

describe('ShowFormModalComponent', () => {
  let component: ShowFormModalComponent;
  let fixture: ComponentFixture<ShowFormModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowFormModalComponent]
    });
    fixture = TestBed.createComponent(ShowFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
