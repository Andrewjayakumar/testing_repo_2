import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabUiComponent } from './tab-ui.component';

describe('TabUiComponent', () => {
  let component: TabUiComponent;
  let fixture: ComponentFixture<TabUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
