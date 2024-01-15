import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollHTabsComponent } from './scroll-h-tabs.component';

describe('ScrollHTabsComponent', () => {
  let component: ScrollHTabsComponent;
  let fixture: ComponentFixture<ScrollHTabsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScrollHTabsComponent]
    });
    fixture = TestBed.createComponent(ScrollHTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
