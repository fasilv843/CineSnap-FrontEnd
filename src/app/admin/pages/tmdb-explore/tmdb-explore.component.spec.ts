import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTmdbExploreComponent } from './tmdb-explore.component';

describe('AdminTmdbExploreComponent', () => {
  let component: AdminTmdbExploreComponent;
  let fixture: ComponentFixture<AdminTmdbExploreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [AdminTmdbExploreComponent]
});
    fixture = TestBed.createComponent(AdminTmdbExploreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
