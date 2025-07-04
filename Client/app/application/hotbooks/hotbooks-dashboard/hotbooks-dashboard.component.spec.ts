import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotbooksDashboardComponent } from './hotbooks-dashboard.component';

describe('HotbooksDashboardComponent', () => {
  let component: HotbooksDashboardComponent;
  let fixture: ComponentFixture<HotbooksDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotbooksDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotbooksDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
