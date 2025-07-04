import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhonenumberUiComponent } from './phonenumber-ui.component';

describe('PhonenumberUiComponent', () => {
  let component: PhonenumberUiComponent;
  let fixture: ComponentFixture<PhonenumberUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhonenumberUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhonenumberUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
