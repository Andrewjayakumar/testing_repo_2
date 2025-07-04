import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartUiComponent } from './chart-ui.component';

describe('ChartUiComponent', () => {
  let component: ChartUiComponent;
  let fixture: ComponentFixture<ChartUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
