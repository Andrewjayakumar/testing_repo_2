import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteUiComponent } from './website-ui.component';

describe('WebsiteUiComponent', () => {
  let component: WebsiteUiComponent;
  let fixture: ComponentFixture<WebsiteUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebsiteUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsiteUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
