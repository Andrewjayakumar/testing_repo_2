import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelUiComponent } from './panel-ui.component';

describe('PanelUiComponent', () => {
  let component: PanelUiComponent;
  let fixture: ComponentFixture<PanelUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
