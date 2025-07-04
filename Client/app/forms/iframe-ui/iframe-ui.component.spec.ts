import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IframeUiComponent } from './iframe-ui.component';

describe('IframeUiComponent', () => {
  let component: IframeUiComponent;
  let fixture: ComponentFixture<IframeUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IframeUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IframeUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
