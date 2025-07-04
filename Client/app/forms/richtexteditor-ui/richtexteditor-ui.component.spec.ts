import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RichtexteditorUiComponent } from './richtexteditor-ui.component';

describe('RichtexteditorUiComponent', () => {
  let component: RichtexteditorUiComponent;
  let fixture: ComponentFixture<RichtexteditorUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RichtexteditorUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RichtexteditorUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
