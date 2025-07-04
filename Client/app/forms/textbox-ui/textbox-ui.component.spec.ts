import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextboxUiComponent } from './textbox-ui.component';

describe('TextboxUiComponent', () => {
  let component: TextboxUiComponent;
  let fixture: ComponentFixture<TextboxUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextboxUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextboxUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
