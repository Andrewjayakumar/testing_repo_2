import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormeditorComponent } from './formeditor.component';

describe('FormeditorComponent', () => {
  let component: FormeditorComponent;
  let fixture: ComponentFixture<FormeditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormeditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormeditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
