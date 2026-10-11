import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTheaterDetailComponent } from './theater-detail.component';

describe('UserTheaterDetailComponent', () => {
  let component: UserTheaterDetailComponent;
  let fixture: ComponentFixture<UserTheaterDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [UserTheaterDetailComponent]
});
    fixture = TestBed.createComponent(UserTheaterDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
