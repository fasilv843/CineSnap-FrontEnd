import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTheatersComponent } from './user-theaters.component';

describe('UserTheatersComponent', () => {
  let component: UserTheatersComponent;
  let fixture: ComponentFixture<UserTheatersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserTheatersComponent]
    });
    fixture = TestBed.createComponent(UserTheatersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
