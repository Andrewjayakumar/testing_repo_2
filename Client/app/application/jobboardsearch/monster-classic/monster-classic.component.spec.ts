import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonsterClassicComponent } from './monster-classic.component';

describe('MonsterClassicComponent', () => {
  let component: MonsterClassicComponent;
  let fixture: ComponentFixture<MonsterClassicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonsterClassicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonsterClassicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
