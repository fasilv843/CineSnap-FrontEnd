import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheaterScreensComponent } from './screens.component';

describe('TheaterScreensComponent', () => {
  let component: TheaterScreensComponent;
  let fixture: ComponentFixture<TheaterScreensComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [TheaterScreensComponent]
});
    fixture = TestBed.createComponent(TheaterScreensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
