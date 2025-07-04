import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextareaUiComponent } from './textarea-ui.component';

describe('TextareaUiComponent', () => {
    let component: TextareaUiComponent;
    let fixture: ComponentFixture<TextareaUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [TextareaUiComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
      fixture = TestBed.createComponent(TextareaUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
