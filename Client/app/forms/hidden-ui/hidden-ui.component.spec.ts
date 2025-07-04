import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HiddenUiComponent } from './hidden-ui.component';

describe('HiddenUiComponent', () => {
  let component: HiddenUiComponent;
  let fixture: ComponentFixture<HiddenUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HiddenUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HiddenUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
