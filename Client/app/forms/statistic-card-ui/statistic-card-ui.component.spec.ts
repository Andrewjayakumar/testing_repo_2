import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticCardUiComponent } from './statistic-card-ui.component';

describe('StatisticCardUiComponent', () => {
  let component: StatisticCardUiComponent;
  let fixture: ComponentFixture<StatisticCardUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisticCardUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticCardUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
