import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserShowSeatsComponent } from './show-seats.component';

describe('UserShowSeatsComponent', () => {
  let component: UserShowSeatsComponent;
  let fixture: ComponentFixture<UserShowSeatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [UserShowSeatsComponent]
});
    fixture = TestBed.createComponent(UserShowSeatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
