import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHomeComponent } from './home.component';

describe('UserHomeComponent', () => {
  let component: UserHomeComponent;
  let fixture: ComponentFixture<UserHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [UserHomeComponent]
});
    fixture = TestBed.createComponent(UserHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
