import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOffcanvasComponent } from './user-offcanvas.component';

describe('UserOffcanvasComponent', () => {
  let component: UserOffcanvasComponent;
  let fixture: ComponentFixture<UserOffcanvasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UserOffcanvasComponent]
    });
    fixture = TestBed.createComponent(UserOffcanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
